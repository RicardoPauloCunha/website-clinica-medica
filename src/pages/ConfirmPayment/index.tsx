import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Agendamento from "../../services/entities/agendamento";
import NotaFiscal from "../../services/entities/notaFiscal";
import { listPaymentMethodType } from "../../services/enums/paymentMethodType";
import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus } from "../../services/enums/scheduleStatus";
import PaymentStatusEnum from "../../services/enums/paymentStatus";
import { getSchedulingByIdHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { postPaymentHttp, _listPayment } from "../../services/http/payment";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { formatCellphone, formatCpf, normalizeDate } from "../../util/formatString";

import { Spinner } from "reactstrap";
import { Form, TextGroupGrid } from "../../styles/components";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import StatusBadge from "../../components/StatusBadge";
import InvoiceModal from "../../components/InvoiceModal";

type PaymentFormData = {
    price: number;
    discount: number;
    paymentMethodType: number;
}

const ConfirmPayment = () => {
    const navigate = useNavigate();
    const routeParams = useParams();
    const paymentFormRef = useRef<FormHandles>(null);

    const _itemPayment = _listPayment[0];
    const _paymentMethodTypes = listPaymentMethodType();

    const [isLoading, setIsLoading] = useState<"payment" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [scheduling, setScheduling] = useState<Agendamento | undefined>(undefined);
    const [invoice, setInvoice] = useState<NotaFiscal | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);
        setInvoice(undefined);
        setScheduling(undefined);
        // paymentFormRef.current?.reset();
        // TODO: Descomentar

        if (routeParams.schedulingId !== undefined)
            getScheduling();
        // eslint-disable-next-line
    }, [routeParams]);

    const getScheduling = () => {
        let id = Number(routeParams.schedulingId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getSchedulingByIdHttp(id).then(response => {
            if (response?.status !== ScheduleStatusEnum.Scheduled)
                toggleModal();

            setScheduling(response);
            setIsLoading("");
        });
    }

    const toggleModal = () => {
        navigate("/agendamentos/listar");
    }

    const sendChangeStatus = () => {
        if (scheduling === undefined)
            return;

        scheduling.status = ScheduleStatusEnum.Progress;

        putSchedulingHttp(scheduling).catch(() => {
            setWarning(["danger", "Não foi possível atualizar o status do agendamento."]);
            setIsLoading("");
        });
    }

    const submitPaymentForm: SubmitHandler<PaymentFormData> = async (data, { reset }) => {
        try {
            if (scheduling === undefined) {
                setWarning(["danger", "Agendamento não encontrado."]);
                return;
            }

            setIsLoading("payment");
            setWarning(["", ""]);
            paymentFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                price: Yup.number()
                    .moreThan(0, "Coloque o valor do pagamento."),
                discount: Yup.number()
                    .moreThan(-1, "Coloque um desconto maior que 0."),
                paymentMethodType: Yup.string()
                    .required("Selecione a forma de pagamento.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            postPaymentHttp({
                valor: data.price,
                desconto: data.discount,
                formaDePagamento: Number(data.paymentMethodType),
                status: PaymentStatusEnum.PaidOut,
                idAgendamento: scheduling.idAgendamento
            }).then(response => {
                setInvoice(response.notaFiscal);
                sendChangeStatus();
            }).catch(() => {
                setWarning(["danger", "Não foi possível confirmar o pagamento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                paymentFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do pagamento inválidos."]);
            setIsLoading("");
        }
    }

    return (
        <>
            <h1>Confirmar pagamento</h1>

            <Form
                ref={paymentFormRef}
                onSubmit={submitPaymentForm}
                className="form-data"
                initialData={{
                    price: _itemPayment.valor.toFixed(2),
                    discount: _itemPayment.desconto.toFixed(2),
                }}
            >
                <CurrencyInput
                    name='price'
                    label='Preço'
                />

                <CurrencyInput
                    name='discount'
                    label='Desconto'
                />

                <SelectInput
                    name='paymentMethodType'
                    label='Forma de pagamento'
                    placeholder='Selecione a forma de pagamento'
                    options={_paymentMethodTypes.map((x, index) => ({
                        value: `${index + 1}`,
                        label: x
                    }))}
                />

                <LoadingButton
                    text="Confirmar"
                    isLoading={isLoading === "payment"}
                    type='submit'
                />

                <Warning value={warning} />
            </Form>

            <h2>
                Dados do agendamento

                {isLoading === "get" && <>
                    {' '}
                    <Spinner
                        color="primary"
                        type="grow"
                    />
                </>}
            </h2>

            {scheduling !== undefined && <DataCard
                title={scheduling.paciente?.nome}
                subtitle={formatCpf(scheduling.paciente?.cpf)}
            >
                <TextGroupGrid>
                    <DataText
                        label="Contato"
                        value={formatCellphone(scheduling.paciente?.contato)}
                    />

                    <DataText
                        label="Data agendamento"
                        value={new Date(scheduling.dataAgendada + "T" + scheduling.horaAgendada).toLocaleString()}
                    />

                    <StatusBadge
                        label="Status"
                        status={scheduling.status}
                        value={getValueScheduleStatus(scheduling.status)}
                        defineColor={defineColorScheduleStatus}
                    />

                    <DataText
                        label="Serviço"
                        value={scheduling.servico?.nomeServico}
                    />

                    <DataText
                        label="Médico"
                        value={scheduling.medico?.nomeFuncionario}
                    />

                    <DataText
                        label="Especialidade"
                        value={scheduling.medico?.especialidade?.nomeEspecialidade}
                    />

                    <DataText
                        label="Data"
                        value={new Date(normalizeDate(scheduling.data)).toLocaleDateString()}
                    />
                </TextGroupGrid>
            </DataCard>}

            <InvoiceModal
                showModal={invoice !== undefined}
                toggleModal={toggleModal}
                invoice={invoice}
                patient={scheduling?.paciente}
            />
        </>
    );
}

export default ConfirmPayment;
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Pagamento from "../../services/entities/pagamento";
import NotaFiscal from "../../services/entities/notaFiscal";
import PaymentStatusEnum from "../../services/enums/paymentStatus";
import { getValuePaymentMethodType, listPaymentMethodType } from "../../services/enums/paymentMethodType";
import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus } from "../../services/enums/scheduleStatus";
import { getPaymentByIdHttp, putPaymentHttp } from "../../services/http/payment";
import { postRefundHttp, _listRefund } from "../../services/http/refund";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { formatCurrency } from "../../util/formatCurrency";
import { formatCellphone, formatCpf, normalizeDate } from "../../util/formatString";

import { Spinner } from "reactstrap";
import { Form, TextGroupGrid } from "../../styles/components";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";
import StatusBadge from "../../components/StatusBadge";
import InvoiceModal from "../../components/InvoiceModal";

type RefundFormData = {
    price: number;
    paymentMethodType: number;
    description: string;
}

const RefundPayment = () => {
    const navigate = useNavigate();
    const routeParams = useParams();
    const refundFormRef = useRef<FormHandles>(null);

    const _itemRefund = _listRefund[0];
    const _paymentMethodTypes = listPaymentMethodType();

    const [isLoading, setIsLoading] = useState<"refund" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [payment, setPayment] = useState<Pagamento | undefined>(undefined);
    const [invoice, setInvoice] = useState<NotaFiscal | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);
        // refundFormRef.current?.reset();
        // TODO: Descomentar

        if (routeParams.paymentId !== undefined)
            getPayment();
        // eslint-disable-next-line
    }, [routeParams]);

    const getPayment = () => {
        let id = Number(routeParams.paymentId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getPaymentByIdHttp(id).then(response => {
            if (response.status !== PaymentStatusEnum.PaidOut
                || (response?.agendamento?.status !== ScheduleStatusEnum.Progress
                    && response?.agendamento?.status !== ScheduleStatusEnum.Concluded))
                toggleModal();

            setPayment(response);
            setIsLoading("");
        });
    }

    const toggleModal = () => {
        navigate("/agendamentos/listar");
    }

    const sendPaymentStatus = async () => {
        if (payment === undefined)
            return;

        await putPaymentHttp({
            pagamentoId: payment.idPagamento,
            idAgendamento: payment.agendamento?.idAgendamento as number,
            valor: payment.valor,
            status: PaymentStatusEnum.Reimbursed,
            formaDePagamento: payment.formaDePagamento,
            desconto: payment.desconto
        }).catch(() => {
            setWarning(["danger", "Não foi possível atualizar o pagamento."]);
            setIsLoading("");
        });
    }

    const submitPaymentForm: SubmitHandler<RefundFormData> = async (data, { reset }) => {
        try {
            if (payment === undefined) {
                setWarning(["danger", "Pagamento não encontrado."]);
                return;
            }

            setIsLoading("refund");
            setWarning(["", ""]);
            refundFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                price: Yup.number()
                    .moreThan(0, "Coloque o valor do ressarcimento."),
                paymentMethodType: Yup.string()
                    .required("Selecione a forma de ressarcimento."),
                description: Yup.string()
                    .required("Coloque a descrição do ressarcimento")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            postRefundHttp({
                valor: data.price,
                idPagamento: payment.idPagamento,
                status: 1,
                formaDeRessarcimento: data.paymentMethodType,
                motivoRessarcimento: data.description,
            }).then(respones => {
                setInvoice(respones.notaFiscal);
                sendPaymentStatus();
            }).catch(() => {
                setWarning(["danger", "Não foi possível ressarcir o pagamento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                refundFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do ressarcimento inválidos."]);
            setIsLoading("");
        }
    }

    return (
        <>
            <h1>Ressarcir pagamento</h1>

            <Form
                ref={refundFormRef}
                onSubmit={submitPaymentForm}
                className="form-data"
                initialData={{
                    price: _itemRefund.valor.toFixed(2),
                    description: _itemRefund.motivoRessarcimento,
                }}
            >
                <CurrencyInput
                    name='price'
                    label='Preço'
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

                <FieldInput
                    name="description"
                    label="Descrição do motivo de ressarcimento"
                    type="textarea"
                    rows="4"
                />

                <LoadingButton
                    text="Ressarcir"
                    isLoading={isLoading === "refund"}
                    type='submit'
                />

                <Warning value={warning} />
            </Form>

            <h2>
                Dados do pagamento

                {isLoading === "get" && <>
                    {' '}
                    <Spinner
                        color="primary"
                        type="grow"
                    />
                </>}
            </h2>

            {payment !== undefined && <>
                <DataCard
                    title={formatCurrency(payment.valor)}
                    subtitle={getValuePaymentMethodType(payment.formaDePagamento)}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Desconto"
                            value={formatCurrency(payment.desconto)}
                        />

                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(payment.data)).toLocaleDateString()}
                        />
                    </TextGroupGrid>
                </DataCard>

                <h2>Dados do agendamento</h2>

                <DataCard
                    title={payment.agendamento?.paciente?.nome}
                    subtitle={formatCpf(payment.agendamento?.paciente?.cpf)}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Contato"
                            value={formatCellphone(payment.agendamento?.paciente?.contato)}
                        />

                        <DataText
                            label="Data agendamento"
                            value={new Date(payment.agendamento?.dataAgendada + "T" + payment.agendamento?.horaAgendada).toLocaleString()}
                        />

                        <StatusBadge
                            label="Status"
                            status={payment.agendamento?.status}
                            value={getValueScheduleStatus(payment.agendamento?.status as ScheduleStatusEnum)}
                            defineColor={defineColorScheduleStatus}
                        />


                        <DataText
                            label="Serviço"
                            value={payment.agendamento?.servico?.nomeServico}
                        />

                        <DataText
                            label="Médico"
                            value={payment.agendamento?.medico?.nomeFuncionario}
                        />

                        <DataText
                            label="Especialidade"
                            value={payment.agendamento?.medico?.especialidade?.nomeEspecialidade}
                        />

                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(payment.agendamento?.data)).toLocaleDateString()}
                        />
                    </TextGroupGrid>
                </DataCard>
            </>}

            <InvoiceModal
                showModal={invoice !== undefined}
                toggleModal={toggleModal}
                invoice={invoice}
                patient={payment?.agendamento?.paciente}
            />
        </>
    );
}

export default RefundPayment;
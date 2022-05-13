import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Agendamento from "../../services/entities/agendamento";
import NotaFiscal from "../../services/entities/notaFiscal";
import { listPaymentMethodType } from "../../services/enums/paymentMethodType";
import ScheduleStatusEnum from "../../services/enums/scheduleStatus";
import PaymentStatusEnum from "../../services/enums/paymentStatus";
import { getSchedulingByIdHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { postPaymentHttp } from "../../services/http/payment";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import DocumentTitle from "../../util/documentTitle";

import { Form } from "../../styles/components";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import InvoiceModal from "../../components/InvoiceModal";
import SchedulingCollapseCard from "../../components/CollapseCard/scheduling";

type PaymentFormData = {
    price: number;
    discount: number;
    paymentMethodType: number;
}

const ConfirmPayment = () => {
    const navigate = useNavigate();
    const routeParams = useParams();
    const paymentFormRef = useRef<FormHandles>(null);

    const _paymentMethodTypes = listPaymentMethodType();

    const [isLoading, setIsLoading] = useState<"payment" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [scheduling, setScheduling] = useState<Agendamento | undefined>(undefined);
    const [invoice, setInvoice] = useState<NotaFiscal | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);
        setInvoice(undefined);
        setScheduling(undefined);
        paymentFormRef.current?.reset();

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
            if (response.status !== ScheduleStatusEnum.Scheduled)
                toggleModal();

            setScheduling(response);
            setIsLoading("");

            setTimeout(() => {
                paymentFormRef.current?.setFieldValue("price", response.servico.valor.toFixed(2));
            }, 100);
        }).catch(() => {
            setWarning(["danger", "Agendamento não encontrado."]);
        });
    }

    const toggleModal = () => {
        navigate("/agendamentos/listar");
    }

    const sendSchedulingStatus = () => {
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

            if (data.discount >= data.price) {
                setIsLoading("");
                setWarning(["warning", "Campos do pagamento inválidos."]);
                paymentFormRef.current?.setFieldError("discount", "O desconto precisa ser menor que o preço do pagamento.");
                return;
            }

            postPaymentHttp({
                valor: data.price,
                desconto: data.discount,
                formaDePagamento: Number(data.paymentMethodType),
                status: PaymentStatusEnum.PaidOut,
                idAgendamento: scheduling.idAgendamento
            }).then(response => {
                setInvoice(response.notaFiscal);
                sendSchedulingStatus();
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

    DocumentTitle("Confirmar pagamento | CM");

    return (
        <>
            <h1>Confirmar pagamento</h1>

            <Form
                ref={paymentFormRef}
                onSubmit={submitPaymentForm}
                className="form-data"
            >
                {scheduling !== undefined && <SchedulingCollapseCard
                    id={scheduling.idAgendamento}
                    patientName={scheduling.paciente.nome}
                    patientCpf={scheduling.paciente.cpf}
                    patientContact={scheduling.paciente.contato}
                    time={scheduling.horaAgendada}
                    date={scheduling.dataAgendada}
                    creationDate={scheduling.data}
                    status={scheduling.status}
                    serviceName={scheduling.servico.nomeServico}
                    doctorName={scheduling.medico.nomeFuncionario}
                    specialtyName={scheduling.medico.especialidade.nomeEspecialidade}
                />}

                <CurrencyInput
                    name='price'
                    label='Preço'
                    disabled={true}
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

                <Warning value={warning} />

                <LoadingButton
                    text="Confirmar"
                    isLoading={isLoading === "payment" || isLoading === "get"}
                    type='submit'
                    color="secondary"
                />
            </Form>

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
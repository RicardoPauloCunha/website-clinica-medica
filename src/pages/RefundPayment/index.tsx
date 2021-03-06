import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Pagamento from "../../services/entities/pagamento";
import NotaFiscal from "../../services/entities/notaFiscal";
import PaymentStatusEnum from "../../services/enums/paymentStatus";
import { listPaymentMethodType } from "../../services/enums/paymentMethodType";
import ScheduleStatusEnum from "../../services/enums/scheduleStatus";
import { getPaymentByIdHttp, putPaymentHttp } from "../../services/http/payment";
import { postRefundHttp } from "../../services/http/refund";
import { putSchedulingHttp } from "../../services/http/scheduling";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import DocumentTitle from "../../util/documentTitle";

import { Form } from "../../styles/components";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";
import InvoiceModal from "../../components/InvoiceModal";
import SchedulingCollapseCard from "../../components/CollapseCard/scheduling";
import PaymentCollapseCard from "../../components/CollapseCard/payment";

type RefundFormData = {
    price: number;
    paymentMethodType: number;
    description: string;
}

const RefundPayment = () => {
    const navigate = useNavigate();
    const routeParams = useParams();
    const refundFormRef = useRef<FormHandles>(null);

    const _paymentMethodTypes = listPaymentMethodType();

    const [isLoading, setIsLoading] = useState<"refund" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [payment, setPayment] = useState<Pagamento | undefined>(undefined);
    const [invoice, setInvoice] = useState<NotaFiscal | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);
        refundFormRef.current?.reset();

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
                || (response.agendamento.status !== ScheduleStatusEnum.Progress
                    && response.agendamento.status !== ScheduleStatusEnum.Concluded))
                toggleModal();

            setPayment(response);
            setIsLoading("");

            let refundPrice = response.valor - response.desconto;

            setTimeout(() => {
                refundFormRef.current?.setFieldValue("price", refundPrice.toFixed(2));
            }, 100);
        }).catch(() => {
            setWarning(["danger", "Pagamento n??o encontrado."]);
        });
    }

    const toggleModal = () => {
        navigate("/agendamentos/listar");
    }

    const sendPaymentStatus = async () => {
        if (payment === undefined)
            return;

        payment.status = PaymentStatusEnum.Reimbursed;

        await putPaymentHttp(payment).then(() => {
            if (payment.agendamento.status === ScheduleStatusEnum.Progress)
                sendSchedulingStatus();
        }).catch(() => {
            setWarning(["danger", "N??o foi poss??vel atualizar o pagamento."]);
        });
    }

    const sendSchedulingStatus = () => {
        let scheduling = payment?.agendamento;
        if (scheduling === undefined)
            return;

        scheduling.status = ScheduleStatusEnum.Canceled;

        putSchedulingHttp(scheduling).catch(() => {
            setWarning(["danger", "N??o foi poss??vel atualizar o status do agendamento."]);
            setIsLoading("");
        });
    }

    const submitPaymentForm: SubmitHandler<RefundFormData> = async (data, { reset }) => {
        try {
            if (payment === undefined) {
                setWarning(["danger", "Pagamento n??o encontrado."]);
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
                    .required("Coloque a descri????o do ressarcimento")
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
                setWarning(["danger", "N??o foi poss??vel ressarcir o pagamento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                refundFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do ressarcimento inv??lidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle("Ressarcimento | CM");

    return (
        <>
            <h1>Ressarcir pagamento</h1>

            <Form
                ref={refundFormRef}
                onSubmit={submitPaymentForm}
                className="form-data"
            >
                {payment !== undefined && <>
                    <SchedulingCollapseCard
                        id={payment.agendamento.idAgendamento}
                        patientName={payment.agendamento.paciente.nome}
                        patientCpf={payment.agendamento.paciente.cpf}
                        patientContact={payment.agendamento.paciente.contato}
                        time={payment.agendamento.horaAgendada}
                        date={payment.agendamento.dataAgendada}
                        creationDate={payment.agendamento.data}
                        status={payment.agendamento.status}
                        serviceName={payment.agendamento.servico.nomeServico}
                        doctorName={payment.agendamento.medico.nomeFuncionario}
                        specialtyName={payment.agendamento.medico.especialidade.nomeEspecialidade}
                    />

                    <PaymentCollapseCard
                        id={payment.idPagamento}
                        price={payment.valor}
                        discount={payment.desconto}
                        paymentMethodType={payment.formaDePagamento}
                        date={payment.data}
                    />
                </>}

                <CurrencyInput
                    name='price'
                    label='Pre??o'
                    disabled={true}
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
                    label="Descri????o do motivo de ressarcimento"
                    type="textarea"
                    rows="4"
                />

                <Warning value={warning} />

                <LoadingButton
                    text="Ressarcir"
                    isLoading={isLoading === "refund" || isLoading === "get"}
                    type='submit'
                    color="secondary"
                />
            </Form>

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
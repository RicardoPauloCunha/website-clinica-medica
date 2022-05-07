import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import { getValuePaymentMethodType, listPaymentMethodType } from "../../services/enums/paymentMethodType";
import PaymentStatusEnum from "../../services/enums/paymentStatus";
import ScheduleStatusEnum, { getValueScheduleStatus } from "../../services/enums/scheduleStatus";
import Pagamento from "../../services/entities/pagamento";
import { getPaymentByIdHttp, putPaymentHttp } from "../../services/http/payment";
import { postRefundHttp, _listRefund } from "../../services/http/refund";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { numberToCurrency } from "../../util/convertCurrency";

import { Spinner } from "reactstrap";
import { Form, TextGroupGrid } from "../../styles/components";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";

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
            setPayment(response);
            setIsLoading("");
        });
    }

    const sendPaymentStatus = async () => {
        if (payment === undefined)
            return;

        await putPaymentHttp({
            pagamentoId: payment.idPagamento,
            agendamentoId: payment.agendamento?.idAgendamento as number,
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
                pagamentoId: payment.idPagamento,
                status: 1,
                formaDeRessarcimento: data.paymentMethodType,
                motivoRessarcimento: data.description,
            }).then(() => {
                sendPaymentStatus().then(() => {
                    reset();
                    setPayment(undefined);
                    navigate("/pagamentos/" + payment.idPagamento + "/nota-fiscal");
                });
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
                    title={numberToCurrency(payment.valor)}
                    subtitle={getValuePaymentMethodType(payment.formaDePagamento)}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Desconto"
                            value={numberToCurrency(payment.desconto)}
                        />

                        <DataText
                            label="Data"
                            value={new Date(payment.data).toLocaleDateString()}
                        />
                    </TextGroupGrid>
                </DataCard>

                <h2>Dados do agendamento</h2>

                <DataCard
                    title={payment.agendamento?.paciente?.nome as string}
                    subtitle={payment.agendamento?.paciente?.cpf}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Contato"
                            value={payment.agendamento?.paciente?.contato as string}
                        />

                        <DataText
                            label="Serviço"
                            value={payment.agendamento?.servico?.nomeServico as string}
                        />

                        <DataText
                            label="Data"
                            value={new Date(payment.agendamento?.data as string).toLocaleDateString()}
                        />

                        <DataText
                            label="Data agendamento"
                            value={new Date(payment.agendamento?.dataAgendada + "T" + payment.agendamento?.horaAgendada).toLocaleString()}
                        />

                        <DataText
                            label="Status agendamento"
                            value={getValueScheduleStatus(payment.agendamento?.status as ScheduleStatusEnum)}
                        />

                        <DataText
                            label="Médico"
                            value={payment.agendamento?.medico?.nomeFuncionario as string}
                        />

                        <DataText
                            label="Especialidade"
                            value={payment.agendamento?.medico?.especialidade?.nomeEspecialidade as string}
                        />
                    </TextGroupGrid>
                </DataCard>
            </>}
        </>
    );
}

export default RefundPayment;
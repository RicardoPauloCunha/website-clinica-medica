import { get, post, put } from "../api";
import Pagamento from "../entities/pagamento";
import PaymentMethodTypeEnum from "../enums/paymentMethodType";
import PaymentStatusEnum from "../enums/paymentStatus";

import { _listScheduling } from "./scheduling";

const ROOT = "pagamentos/";

export const _listPayment: Pagamento[] = [
    {
        idPagamento: 1,
        data: "2022-05-03",
        valor: 110,
        desconto: 0,
        formaDePagamento: PaymentMethodTypeEnum.Cash,
        status: PaymentStatusEnum.Reimbursed,
        agendamento: _listScheduling[0]
    },
    {
        idPagamento: 2,
        data: "2022-05-03",
        valor: 120,
        desconto: 0,
        formaDePagamento: PaymentMethodTypeEnum.Card,
        status: PaymentStatusEnum.PaidOut,
        agendamento: _listScheduling[1]
    }
];

export const getPaymentByIdHttp = async (paymentId: number): Promise<Pagamento> => {
    let { data } = await get<Pagamento>(ROOT + paymentId);
    return data;
}

export const getPaymentBySchedulingIdHttp = async (schedulingId: number): Promise<Pagamento> => {
    let { data } = await get<Pagamento>(ROOT + "buscar-por-id-agendamento/" + schedulingId);
    return data;
}

interface PostPaymentRequest {
    agendamentoId: number;
    valor: number;
    status: number;
    formaDePagamento: number;
    desconto: number;
}

export const postPaymentHttp = async (requestData: PostPaymentRequest): Promise<Pagamento> => {
    let { data } = await post<PostPaymentRequest, Pagamento>(ROOT, requestData);
    return data;
}

interface PutPaymentRequest extends PostPaymentRequest {
    pagamentoId: number;
}

export const putPaymentHttp = async (requestData: PutPaymentRequest): Promise<void> => {
    await put<PutPaymentRequest, void>(ROOT + requestData.pagamentoId, requestData);
}
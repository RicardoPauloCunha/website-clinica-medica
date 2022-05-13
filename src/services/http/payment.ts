import { get, post, put } from "../api";
import Pagamento from "../entities/pagamento";
import PaymentMethodTypeEnum from "../enums/paymentMethodType";
import PaymentStatusEnum from "../enums/paymentStatus";

const ROOT = "pagamentos/";

export const getPaymentByIdHttp = async (paymentId: number): Promise<Pagamento> => {
    let { data } = await get<Pagamento>(ROOT + paymentId);
    return data;
}

export const getPaymentBySchedulingIdHttp = async (schedulingId: number): Promise<Pagamento> => {
    let { data } = await get<Pagamento>(ROOT + "buscar-por-id-agendamento/" + schedulingId);
    return data;
}

interface PostPaymentRequest {
    idAgendamento: number;
    valor: number;
    status: PaymentStatusEnum;
    formaDePagamento: PaymentMethodTypeEnum;
    desconto: number;
}

export const postPaymentHttp = async (requestData: PostPaymentRequest): Promise<Pagamento> => {
    let { data } = await post<PostPaymentRequest, Pagamento>(ROOT, requestData);
    return data;
}

interface PutPaymentRequest {
    idPagamento: number;
    agendamento: {
        idAgendamento: number;
    }
    notaFiscal: {
        idNotaFiscal: number;
    }
    data: string;
    valor: number;
    status: PaymentStatusEnum;
    formaDePagamento: PaymentMethodTypeEnum;
    desconto: number;
}

export const putPaymentHttp = async (requestData: PutPaymentRequest): Promise<void> => {
    await put<PutPaymentRequest, void>(ROOT, requestData);
}
import Pagamento from "../entities/pagamento";
import PaymentMethodTypeEnum from "../enums/paymentMethodType";
import PaymentStatusEnum from "../enums/paymentStatus";
import { _listScheduling } from "./scheduling";

export const _listPayment: Pagamento[] = [
    {
        idPagamento: 1,
        data: "2022-05-03",
        valor: 110.00,
        desconto: 0.00,
        formaDePagamento: PaymentMethodTypeEnum.Cash,
        status: PaymentStatusEnum.Reimbursed,
        agendamento: _listScheduling[0]
    },
    {
        idPagamento: 2,
        data: "2022-05-03",
        valor: 120.00,
        desconto: 0.00,
        formaDePagamento: PaymentMethodTypeEnum.Card,
        status: PaymentStatusEnum.PaidOut,
        agendamento: _listScheduling[1]
    }
];

export const getPaymentByIdHttp = async (paymentId: number): Promise<Pagamento | undefined> => {
    return _listPayment.find(x => x.idPagamento === paymentId);
}

export const getPaymentBySchedulingIdHttp = async (schedulingId: number): Promise<Pagamento | undefined> => {
    return _listPayment.find(x => x.agendamento?.idAgendamento === schedulingId);
}

type PostPaymentRequest = {
    valor: number;
    desconto: number;
    formaDePagamento: number;
    status: number;
    agendamentoId: number;
}

export const postPaymentHttp = async (requestData: PostPaymentRequest): Promise<Pagamento> => {
    return _listPayment[0];
}

export const putPaymentHttp = async (requestData: Pagamento): Promise<void> => {
    
}
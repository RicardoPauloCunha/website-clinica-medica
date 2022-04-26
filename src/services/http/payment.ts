import { SuccessResponse } from "../defaultEntities";
import Pagamento from "../entities/pagamento";
import { getEnumPaymentMethodType } from "../enums/paymentMethodType";
import { getEnumPaymentStatus } from "../enums/paymentStatus";

export const _listPayment: Pagamento[] = [
    {
        idPagamento: 1,
        data: "24/04/2022",
        valor: 110.00,
        desconto: 0.00,
        formaDePagamento: getEnumPaymentMethodType("cash"),
        status: getEnumPaymentStatus("paid-out")
    },
    {
        idPagamento: 2,
        data: "24/04/2022",
        valor: 120.00,
        desconto: 0.00,
        formaDePagamento: getEnumPaymentMethodType("card"),
        status: getEnumPaymentStatus("reimbursed")
    }
];

export const getPaymentBySchedulingIdHttp = async (schedulingId: number): Promise<Pagamento | undefined> => {
    return _listPayment.find(x => x.agendamento?.idAgendamento === schedulingId);
}

export const postPaymentHttp = async (requestData: Pagamento): Promise<SuccessResponse> => {
    return { message: "" };
}
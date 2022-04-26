import { SuccessResponse } from "../defaultEntities";
import Ressarcimento from "../entities/ressarcimento";
import { getEnumPaymentMethodType } from "../enums/paymentMethodType";

export const _listRefund: Ressarcimento[] = [
    {
        idRessarcimento: 1,
        data: "25/04/2022",
        valor: 120.00,
        motivoRessarcimento: "Existem muitas variações disponíveis de passagens de Lorem Ipsum, mas a maioria sofreu algum tipo de alteração, seja por inserção de passagens com humor, ou palavras aleatórias que não parecem nem um pouco convincentes.",
        formaDeRessarcimento: getEnumPaymentMethodType("pix")
    }
];

export const getRefundBySchedulingIdHttp = async (schedulingId: number): Promise<Ressarcimento | undefined> => {
    return _listRefund.find(x => x.pagamento?.agendamento?.idAgendamento === schedulingId);
}

export const postRefundHttp = async (requestData: Ressarcimento): Promise<SuccessResponse> => {
    return { message: "" };
}

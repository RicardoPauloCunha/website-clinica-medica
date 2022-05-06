import { SuccessResponse } from "../defaultEntities";
import Ressarcimento from "../entities/ressarcimento";
import PaymentMethodTypeEnum from "../enums/paymentMethodType";
import { _listPayment } from "./payment";

export const _listRefund: Ressarcimento[] = [
    {
        idRessarcimento: 1,
        data: "2022-05-03",
        valor: 120,
        motivoRessarcimento: "Existem muitas variações disponíveis de passagens de Lorem Ipsum, mas a maioria sofreu algum tipo de alteração, seja por inserção de passagens com humor, ou palavras aleatórias que não parecem nem um pouco convincentes.",
        formaDeRessarcimento: PaymentMethodTypeEnum.Pix,
        pagamento: _listPayment[0]
    }
];

export const getRefundByPaymentIdHttp = async (paymentId: number): Promise<Ressarcimento | undefined> => {
    return _listRefund.find(x => x.pagamento?.idPagamento === paymentId);
}

type PostRefundRequest = {
    valor: number;
    motivoRessarcimento: string;
    formaDeRessarcimento: number;
    pagamentoId: number;
}

export const postRefundHttp = async (requestData: PostRefundRequest): Promise<SuccessResponse> => {
    return { message: "" };
}

import { post } from "../api";
import Ressarcimento from "../entities/ressarcimento";
import PaymentMethodTypeEnum from "../enums/paymentMethodType";

import { _listInvoice } from "./invoice";
import { _listPayment } from "./payment";

const ROOT = "ressarcimentos/";

export const _listRefund: Ressarcimento[] = [
    {
        idRessarcimento: 1,
        pagamento: _listPayment[0],
        notaFiscal: _listInvoice[2],
        data: "2022-05-03",
        valor: 120,
        status: 1,
        formaDeRessarcimento: PaymentMethodTypeEnum.Pix,
        motivoRessarcimento: "Existem muitas variações disponíveis de passagens de Lorem Ipsum, mas a maioria sofreu algum tipo de alteração, seja por inserção de passagens com humor, ou palavras aleatórias que não parecem nem um pouco convincentes."
    }
];

export const getRefundByPaymentIdHttp = async (paymentId: number): Promise<Ressarcimento | undefined> => {
    // TODO: integração API
    return _listRefund[0];
}

interface PostRefundRequest {
    idPagamento: number;
    valor: number;
    status: 1;
    formaDeRessarcimento: number;
    motivoRessarcimento: string;
}

export const postRefundHttp = async (requestData: PostRefundRequest): Promise<Ressarcimento> => {
    let { data } = await post<PostRefundRequest, Ressarcimento>(ROOT, requestData);
    return data;
}

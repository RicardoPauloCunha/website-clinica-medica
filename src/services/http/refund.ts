import { get, post } from "../api";

import Ressarcimento from "../entities/ressarcimento";
import PaymentMethodTypeEnum from "../enums/paymentMethodType";

const ROOT = "ressarcimentos/";

export const getRefundByPaymentIdHttp = async (paymentId: number): Promise<Ressarcimento> => {
    let { data } = await get<Ressarcimento>(ROOT + "buscar-por-id-pagamento/" + paymentId);
    return data;
}

interface PostRefundRequest {
    idPagamento: number;
    valor: number;
    status: number;
    formaDeRessarcimento: PaymentMethodTypeEnum;
    motivoRessarcimento: string;
}

export const postRefundHttp = async (requestData: PostRefundRequest): Promise<Ressarcimento> => {
    let { data } = await post<PostRefundRequest, Ressarcimento>(ROOT, requestData);
    return data;
}

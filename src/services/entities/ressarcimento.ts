import NotaFiscal from "./notaFiscal";
import Pagamento from "./pagamento";

import PaymentMethodTypeEnum from "../enums/paymentMethodType";

interface Ressarcimento {
    idRessarcimento: number;
    pagamento: Pagamento;
    notaFiscal: NotaFiscal
    data: string;
    valor: number;
    status: number;
    formaDeRessarcimento: PaymentMethodTypeEnum;
    motivoRessarcimento: string;
}

export default Ressarcimento;
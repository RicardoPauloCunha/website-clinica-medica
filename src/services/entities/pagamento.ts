import Agendamento from "./agendamento";
import NotaFiscal from "./notaFiscal";

import PaymentMethodTypeEnum from "../enums/paymentMethodType";
import PaymentStatusEnum from "../enums/paymentStatus";

interface Pagamento {
    idPagamento: number;
    agendamento: Agendamento;
    notaFiscal: NotaFiscal;
    data: string;
    valor: number;
    status: PaymentStatusEnum;
    formaDePagamento: PaymentMethodTypeEnum;
    desconto: number;
}

export default Pagamento;
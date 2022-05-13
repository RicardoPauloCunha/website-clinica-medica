import PaymentMethodTypeEnum from "../enums/paymentMethodType";
import PaymentStatusEnum from "../enums/paymentStatus";
import Agendamento from "./agendamento";
import NotaFiscal from "./notaFiscal";

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
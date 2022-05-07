import Agendamento from "./agendamento";
import NotaFiscal from "./notaFiscal";

interface Pagamento {
    idPagamento: number;
    agendamento?: Agendamento;
    notaFiscal?: NotaFiscal;
    data: string;
    valor: number;
    status: number;
    formaDePagamento: number;
    desconto: number;
}

export default Pagamento;
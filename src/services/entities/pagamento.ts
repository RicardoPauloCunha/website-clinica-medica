import Agendamento from "./agendamento";

interface Pagamento {
    idPagamento: number;
    data: string;
    valor: number;
    desconto: number;
    formaDePagamento: number;
    status: number;
    agendamento?: Agendamento;
}

export default Pagamento;
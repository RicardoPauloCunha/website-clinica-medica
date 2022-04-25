import Agendamento from "./agendamento";

type Pagamento = {
    idPagamento: number;
    data: string;
    valor: number;
    desconto: number;
    formaDePagamento: number;
    status: number;
    agendamento?: Agendamento;

}

export default Pagamento;
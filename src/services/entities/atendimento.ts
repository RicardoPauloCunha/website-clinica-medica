import Agendamento from "./agendamento";

interface Atendimento {
    idAtendimento: number;
    data: string;
    observacoes: string;
    diagnostico: string;
    agendamento?: Agendamento;
}

export default Atendimento;
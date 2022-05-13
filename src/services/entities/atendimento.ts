import Agendamento from "./agendamento";

interface Atendimento {
    idAtendimento: number;
    agendamento: Agendamento;
    data: string;
    observacoes: string;
    diagnostico: string;
}

export default Atendimento;
import Agendamento from "./agendamento";

interface Atendimento {
    idAtendimento: number;
    data: string;
    observacoes: string;
    diagnostico: string;
    Agendamento?: Agendamento;
}

export default Atendimento;
import Agendamento from "./agendamento";

type Atendimento = {
    idAtendimento: number;
    data: string;
    observacoes: string;
    diagnostico: string;
    Agendamento?: Agendamento;
}

export default Atendimento;
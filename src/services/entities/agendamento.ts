import Medico from "./medico";
import Paciente from "./paciente";
import Servico from "./servico";

type Agendamento = {
    idAgendamento: number;
    idRecepcionista: number;
    data: string;
    dataAgendada: string;
    status: number;
    servico?: Servico;
    medico?: Medico;
    paciente?: Paciente;
}

export default Agendamento;
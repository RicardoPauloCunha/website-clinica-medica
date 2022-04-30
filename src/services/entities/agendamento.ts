import Funcionario from "./funcionario";
import Medico from "./medico";
import Paciente from "./paciente";
import Servico from "./servico";

interface Agendamento {
    idAgendamento: number;
    data: string;
    dataAgendada: string;
    status: number;
    servico?: Servico;
    medico?: Medico;
    funcionario?: Funcionario;
    paciente?: Paciente;
}

export default Agendamento;
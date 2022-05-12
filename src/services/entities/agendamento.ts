import Funcionario from "./funcionario";
import Medico from "./medico";
import Paciente from "./paciente";
import Servico from "./servico";

interface Agendamento {
    idAgendamento: number;
    recepcionista: Funcionario;
    paciente: Paciente;
    medico: Medico;
    data: string;
    dataAgendada: string;
    horaAgendada: string;
    servico: Servico;
    status: number;
}

export default Agendamento;
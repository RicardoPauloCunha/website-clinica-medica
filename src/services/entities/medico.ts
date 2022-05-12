import Especialidade from "./especialidade";
import Funcionario from "./funcionario";

interface Medico extends Funcionario {
    crm: string;
    especialidade: Especialidade;
}

export default Medico;
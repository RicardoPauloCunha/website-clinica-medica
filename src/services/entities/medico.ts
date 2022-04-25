import Especialidade from "./especialidade";
import Funcionario from "./funcionario";

type Medico = {
    crm: string;
    funcionario?: Funcionario;
    especialidade?: Especialidade;
}

export default Medico;
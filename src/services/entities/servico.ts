import Especialidade from "./especialidade";

type Servico = {
    idServico: number;
    nome: string;
    valor: number;
    descricao: string;
    especialidade?: Especialidade;
}

export default Servico;
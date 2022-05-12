import Especialidade from "./especialidade";

interface Servico {
    idServico: number;
    nomeServico: string;
    valor: number;
    descricaoServico: string;
    especialidade: Especialidade;
}

export default Servico;
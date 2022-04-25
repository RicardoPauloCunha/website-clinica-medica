import Funcionario from "./funcionario";
import Material from "./material";

export type EntradaSaidaMaterial = {
    idEntradaSaidaMateria: number;
    data: string;
    quantidade: number;
    descricao: string;
    tipoEntradaSaida: number;
    material?: Material;
    funcionario?: Funcionario;
}
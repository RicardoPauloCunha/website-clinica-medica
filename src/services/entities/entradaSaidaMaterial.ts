import RecordTypeEnum from "../enums/recordType";
import Funcionario from "./funcionario";
import Material from "./material";

interface EntradaSaidaMaterial {
    idEntradaSaidaMaterial: number;
    data: string;
    quantidade: number;
    descricao: string;
    material: Material;
    funcionario: Funcionario;
    tipoEntradaSaida: RecordTypeEnum;
}

export default EntradaSaidaMaterial;
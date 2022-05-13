import Funcionario from "./funcionario";
import Material from "./material";

import RecordTypeEnum from "../enums/recordType";

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
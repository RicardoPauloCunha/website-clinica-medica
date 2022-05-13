import MaterialStatusEnum from "../enums/materialStatus";
import CategoriaMaterial from "./categoriaMaterial";
import Fabricante from "./fabricante";

interface Material {
    idMaterial: number;
    nomeMaterial: string;
    unidadeDeMedida: string;
    quantidade: number;
    descricao: string;
    categoriaMaterial: CategoriaMaterial;
    fabricante: Fabricante;
    statusMaterial: MaterialStatusEnum;
}

export default Material;
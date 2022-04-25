import CategoriaMaterial from "./categoriaMaterial";
import Fabricante from "./fabricante";

type Material = {
    idMaterial: number;
    nome: string;
    descricao: string;
    unidadeDeMedida: string;
    quantidade: number;
    status: number;
    categoriaMaterial?: CategoriaMaterial;
    fabricante?: Fabricante;
}

export default Material;
import { get, post, put } from "../api";
import CategoriaMaterial from "../entities/categoriaMaterial";

const ROOT = "categoriasmateriais/";

export const _listCategory: CategoriaMaterial[] = [
    {
        idCategoria: 1,
        nomeCategoria: "Equipamento Diagnóstico"
    },
    {
        idCategoria: 2,
        nomeCategoria: "Equipamento de Terapia"
    },
    {
        idCategoria: 3,
        nomeCategoria: "Equipamento de Apoio Médico-Hospitalar"
    },
    {
        idCategoria: 4,
        nomeCategoria: "Materiais Descartáveis"
    },
    {
        idCategoria: 5,
        nomeCategoria: "Materiais Implantáveis"
    },
    {
        idCategoria: 6,
        nomeCategoria: "Produtos para Diagnóstico de Uso “In-Vitro”"
    }
];

export const listCategoryHttp = async (): Promise<CategoriaMaterial[]> => {
    let { data } = await get<CategoriaMaterial[]>(ROOT);
    return data;
}

interface PostCategoryRequest {
    nomeCategoria: string;
}

export const postCategoryHttp = async (requestData: PostCategoryRequest): Promise<CategoriaMaterial> => {
    let { data } = await post<PostCategoryRequest, CategoriaMaterial>(ROOT, requestData);
    return data;
}

interface PutCategoryRequest extends PostCategoryRequest {
    idCategoria: number;
}

export const putCategoryHttp = async (requestData: PutCategoryRequest): Promise<void> => {
    let { data } = await put<PutCategoryRequest, void>(ROOT + requestData.idCategoria, requestData);
    return data;
}
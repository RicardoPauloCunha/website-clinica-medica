import { get, getParams, post, put } from "../api";

import Material from "../entities/material";
import MaterialStatusEnum from "../enums/materialStatus";

const ROOT = "materiais/";

export const getMaterialByIdHttp = async (materialId: number): Promise<Material> => {
    let { data } = await get<Material>(ROOT + materialId);
    return data;
}

interface ListMaterialByParams {
    idCategoria: number | null;
}

export const listMaterialByParamsHttp = async (paramsData: ListMaterialByParams): Promise<Material[]> => {
    let { data } = await getParams<ListMaterialByParams, Material[]>(ROOT + "idcategoria", paramsData);
    return data;
}

interface PostMaterialRequest {
    nomeMaterial: string;
    unidadeDeMedida: string;
    quantidade: number;
    descricao: string;
    categoriaMaterial: {
        idCategoria: number;
    }
    fabricante: {
        cnpj: string;
    }
    statusMaterial: MaterialStatusEnum;
}

export const postMaterialHttp = async (requestData: PostMaterialRequest): Promise<void> => {
    await post<PostMaterialRequest, void>(ROOT, requestData);
}

interface PutMaterialRequest extends PostMaterialRequest {
    idMaterial: number;
}

export const putMaterialHttp = async (requestData: PutMaterialRequest): Promise<void> => {
    await put<PutMaterialRequest, void>(ROOT + "alterarmaterial", requestData);
}
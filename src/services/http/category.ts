import { get, post, put } from "../api";
import CategoriaMaterial from "../entities/categoriaMaterial";

const ROOT = "categoriasmateriais/";

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
    await put<PutCategoryRequest, void>(ROOT + requestData.idCategoria, requestData);
}
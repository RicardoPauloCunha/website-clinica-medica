import { get, post, put } from "../api";

import Fabricante from "../entities/fabricante";

const ROOT = "fabricantes/";

export const listManufacturerHttp = async (): Promise<Fabricante[]> => {
    let { data } = await get<Fabricante[]>(ROOT);
    return data;
}

interface PostManufacturerRequest {
    cnpj: string;
    nomeFabricante: string;
    enderecoFabricante: string;
    contatoFabricante: string;
}

export const postManufacturerHttp = async (requestData: PostManufacturerRequest): Promise<Fabricante> => {
    let { data } = await post<PostManufacturerRequest, Fabricante>(ROOT, requestData);
    return data;
}

interface PutManufacturerRequest extends PostManufacturerRequest {

}

export const putManufacturerHttp = async (requestData: PutManufacturerRequest): Promise<void> => {
    await put<PutManufacturerRequest, Fabricante>(ROOT + requestData.cnpj, requestData);
}
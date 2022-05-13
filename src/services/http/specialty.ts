import { get, post, put } from "../api";

import Especialidade from "../entities/especialidade";

const ROOT = "especialidades/";

export const listSpecialtyHttp = async (): Promise<Especialidade[]> => {
    let { data } = await get<Especialidade[]>(ROOT);
    return data;
}

interface PostSpecialtyRequest {
    nomeEspecialidade: string;
}

export const postSpecialtyHttp = async (requestData: PostSpecialtyRequest): Promise<Especialidade> => {
    let { data } = await post<PostSpecialtyRequest, Especialidade>(ROOT, requestData);
    return data;
}

interface PutSpecialtyRequest extends PostSpecialtyRequest {
    idEspecialidade: number;
}

export const putSpecialtyHttp = async (requestData: PutSpecialtyRequest): Promise<void> => {
    await put<PutSpecialtyRequest, void>(ROOT, requestData);
}
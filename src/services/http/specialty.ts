import { get, post, put } from "../api";
import Especialidade from "../entities/especialidade";

const ROOT = "especialidades/";

export const _listSpecialty: Especialidade[] = [
    {
        idEspecialidade: 1,
        nomeEspecialidade: "Clínica Médica"
    },
    {
        idEspecialidade: 2,
        nomeEspecialidade: "Cirurgia Geral"
    },
    {
        idEspecialidade: 3,
        nomeEspecialidade: "Pediatria"
    },
    {
        idEspecialidade: 4,
        nomeEspecialidade: "Ginecologia"
    },
    {
        idEspecialidade: 5,
        nomeEspecialidade: "Traumatologia"
    },
    {
        idEspecialidade: 6,
        nomeEspecialidade: "Oftalmologia"
    },
    {
        idEspecialidade: 7,
        nomeEspecialidade: "Cardiologia"
    },
    {
        idEspecialidade: 8,
        nomeEspecialidade: "Dermatologia"
    },
    {
        idEspecialidade: 9,
        nomeEspecialidade: "Psiquiatria"
    },
    {
        idEspecialidade: 10,
        nomeEspecialidade: "Infectologia"
    }
];

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
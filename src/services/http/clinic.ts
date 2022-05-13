import { get, post, put } from "../api";
import Clinica from "../entities/Clinica";

const ROOT = "clinica/";

export const getCurrentClinicHttp = async (): Promise<Clinica> => {
    let { data } = await get<Clinica>(ROOT + 1);
    return data;
}

interface PostClinicHttp {
    nome: string;
    cnpj: string;
    endereco: string;
    inscricaoMunicipal: string;
    atividade: string;
}

export const postClinicHttp = async (requestData: PostClinicHttp): Promise<void> => {
    await post<PostClinicHttp, void>(ROOT, requestData);
}

interface PutClinicHttp extends PostClinicHttp {
    idClinica: number;
}

export const putClinicHttp = async (requestData: PutClinicHttp): Promise<void> => {
    await put<PutClinicHttp, void>(ROOT, requestData);
}
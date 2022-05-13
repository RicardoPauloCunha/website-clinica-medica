import { get, post, put } from "../api";
import Paciente from "../entities/paciente";

const ROOT = "pacientes/";

export const getPatientByCpfHttp = async (cpf: string): Promise<Paciente> => {
    let { data } = await get<Paciente>(ROOT + cpf);
    return data;
}

interface PostPatientRequest {
    cpf: string;
    nome: string;
    dataNascimento: string;
    sexo: number;
    endereco: string;
    contato: string;
}

export const postPatientHttp = async (requestData: PostPatientRequest): Promise<Paciente> => {
    let { data } = await post<PostPatientRequest, Paciente>(ROOT, requestData);
    return data;
}

interface PutPatientRequest extends PostPatientRequest {
    
}

export const putPatientHttp = async (requestData: PutPatientRequest): Promise<void> => {
    await put<PutPatientRequest, void>(ROOT + requestData.cpf, requestData);
}
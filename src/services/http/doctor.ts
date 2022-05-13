import { get, getParams, post, put } from "../api";
import Medico from "../entities/medico";
import { PostEmployeeRequest } from "./employee";

const ROOT = "medicos/";

export const getDoctorByIdHttp = async (doctorId: number): Promise<Medico> => {
    let { data } = await get<Medico>(ROOT + doctorId);
    return data;
}

interface ListDoctorByParams {
    idEspecialidade: number | undefined;
}

export const listDoctorByParamsHttp = async (paramsData: ListDoctorByParams): Promise<Medico[]> => {
    let { data } = await getParams<ListDoctorByParams, Medico[]>(ROOT + "listar-por-id-especialidade", paramsData);
    return data;
}

interface PostDoctorRequest extends PostEmployeeRequest {
    crm: string;
    especialidade: {
        idEspecialidade: number;
    }
}

export const postDoctorHttp = async (requestData: PostDoctorRequest): Promise<void> => {
    await post<PostEmployeeRequest, void>(ROOT, requestData);
}

interface PutDoctorRequest extends PostDoctorRequest {
    idFuncionario: number;
}

export const putDoctorHttp = async (requestData: PutDoctorRequest): Promise<void> => {
    await put<PutDoctorRequest, void>(ROOT + "alterar-medico", requestData);
}
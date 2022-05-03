import { getParams, post, put } from "../api";
import Medico from "../entities/medico";
import { PostEmployeeRequest, _listEmployee } from "./employee";
import { _listSpecialty } from "./specialty";

const ROOT = "medicos/";

export const _listDoctor: Medico[] = [
    {
        crm: "000000/SP",
        especialidade: _listSpecialty[0],
        ..._listEmployee[3]
    }
];

export const getDoctorByEmployeeIdHttp = async (employeeId: number): Promise<Medico> => {
    return _listDoctor[0];
}

interface FilterDoctorParams {
    idEspecialidade: number | null;
}

export const listDoctorBySpecialtyHttp = async (paramsData: FilterDoctorParams): Promise<Medico[]> => {
    let { data } = await getParams<FilterDoctorParams, Medico[]>(ROOT + "listar-por-id-especialidade", paramsData);
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
    await put<PostEmployeeRequest, void>(ROOT + "alterar-medico", requestData);
}
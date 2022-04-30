import { SuccessResponse } from "../defaultEntities";
import Medico from "../entities/medico";
import { _listEmployee } from "./employee";
import { _listSpecialty } from "./specialty";

export const _listDoctor: Medico[] = [
    {
        crm: "000000/SP",
        especialidade: _listSpecialty[0],
        ..._listEmployee[2]
    }
];

export const getDoctorByIdHttp = async (crm: string): Promise<Medico | undefined> => {
    return _listDoctor.find(x => x.crm === crm);
}

export const getDoctorByEmployeeIdHttp = async (EmployeeId: number): Promise<Medico | undefined> => {
    return _listDoctor.find(x => x.idFuncionario === EmployeeId);
}

export const listDoctorBySpecialtyHttp = async (specialtyId: number): Promise<Medico[] | undefined> => {
    return _listDoctor.filter(x => x.especialidade?.idEspecialidade === specialtyId);
}

export const postDoctorHttp = async (requestData: Medico): Promise<SuccessResponse> => {
    return { message: "" };
}

export const putDoctorHttp = async (requestData: Medico): Promise<SuccessResponse> => {
    return { message: "" };
}
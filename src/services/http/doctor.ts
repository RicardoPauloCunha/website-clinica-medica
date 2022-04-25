import Medico from "../entities/medico";

export const _listDoctor: Medico[] = [
    {
        crm: "000000/SP"
    }
];

export const getEmployeeByIdHttp = async (crm: string): Promise<Medico | undefined> => {
    return _listDoctor.find(x => x.crm === crm);
}

export const listEmployeeBySpecialtyHttp = async (specialtyId: number): Promise<Medico[] | undefined> => {
    return _listDoctor.filter(x => x.especialidade?.idEspecialidade === specialtyId);
}

export const postDoctorHttp = async (requestData: Medico): Promise<void> => {
    requestData;
}

export const putDoctorHttp = async (requestData: Medico): Promise<void> => {
    requestData;
}
import { SuccessResponse } from "../defaultEntities";
import Agendamento from "../entities/agendamento";
import { getEnumScheduleStatus } from "../enums/scheduleStatus";

export const _listScheduling: Agendamento[] = [
    {
        idAgendamento: 1,
        data: "24/04/2022",
        dataAgendada: "25/04/2022",
        status: getEnumScheduleStatus("scheduled")
    },
    {
        idAgendamento: 2,
        data: "24/04/2022",
        dataAgendada: "25/04/2022",
        status: getEnumScheduleStatus("scheduled")
    },
    {
        idAgendamento: 3,
        data: "24/04/2022",
        dataAgendada: "26/04/2022",
        status: getEnumScheduleStatus("scheduled")
    },
    {
        idAgendamento: 4,
        data: "24/04/2022",
        dataAgendada: "26/04/2022",
        status: getEnumScheduleStatus("scheduled")
    },
];

export const getSchedulingByIdHttp = async (id: number): Promise<Agendamento | undefined> => {
    return _listScheduling.find(x => x.idAgendamento === id);
}

type listReceptionistSchedulingByParamsRequest = {
    cpf?: string;
    status?: number;
}

export const listReceptionistSchedulingByParamsHttp = async (paramsData: listReceptionistSchedulingByParamsRequest): Promise<Agendamento[]> => {
    let list: Agendamento[] = _listScheduling;

    if (paramsData.cpf)
        list = list.filter(x => x.paciente?.cpf === paramsData.cpf);

    if (paramsData.status)
        list = list.filter(x => x.status === paramsData.status)

    return list;
}

type listDoctorSchedulingByParamsRequest = {
    crm: string;
    periodo?: number;
}

export const listDoctorSchedulingByParamsHttp = async (paramsData: listDoctorSchedulingByParamsRequest): Promise<Agendamento[]> => {
    let list: Agendamento[] = _listScheduling.filter(x => x.medico?.crm === paramsData.crm);

    // TODO - filtro por periodo
    
    return list;
}

export const postSchedulingHttp = async (requestData: Agendamento): Promise<SuccessResponse> => {
    return { message: "" };
}

export const putSchedulingHttp = async (requestData: Agendamento): Promise<SuccessResponse> => {
    return { message: "" };
}
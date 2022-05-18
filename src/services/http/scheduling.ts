import { get, getParams, post, put } from "../api";

import Agendamento from "../entities/agendamento";
import ScheduleStatusEnum from "../enums/scheduleStatus";

const ROOT = "agendamentos/";

export const getSchedulingByIdHttp = async (schedulingId: number): Promise<Agendamento> => {
    let { data } = await get<Agendamento>(ROOT + schedulingId);
    return data;
}

interface ListReceptionistSchedulingByParams {
    cpf: string | undefined;
    status: number | undefined;
}

export const listReceptionistSchedulingByParamsHttp = async (paramsData: ListReceptionistSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListReceptionistSchedulingByParams, Agendamento[]>(ROOT + "listar-por-cpf-e-status", paramsData);
    return data;
}

interface ListDoctorSchedulingByParams {
    idMedico: number;
    periodo: number | undefined;
    status: number | undefined;
}

export const listDoctorSchedulingByParamsHttp = async (paramsData: ListDoctorSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListDoctorSchedulingByParams, Agendamento[]>(ROOT + "listar-por-medico-id-e-periodo", paramsData);
    return data;
}

interface PostSchedulingRequest {
    recepcionistaId: number;
    pacienteCpf: string;
    medicoId: number;
    dataAgendada: string;
    horaAgendada: string;
    servicoId: number;
    status: number;
}

export const postSchedulingHttp = async (requestData: PostSchedulingRequest): Promise<void> => {
    await post<PostSchedulingRequest, void>(ROOT, requestData);
}

interface PutScheduling {
    idAgendamento: number;
    recepcionista: {
        idFuncionario: number;
    }
    paciente: {
        cpf: string;
    }
    medico: {
        idFuncionario: number;
    }
    data: string;
    dataAgendada: string;
    horaAgendada: string;
    servico: {
        idServico: number;
    }
    status: ScheduleStatusEnum;
}

export const putSchedulingHttp = async (requestData: PutScheduling): Promise<void> => {
    await put<PutScheduling, void>(ROOT, requestData);
}
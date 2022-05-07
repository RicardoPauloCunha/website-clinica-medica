import { get, getParams, post, put } from "../api";
import Agendamento from "../entities/agendamento";
import ScheduleStatusEnum from "../enums/scheduleStatus";

import { _listDoctor } from "./doctor";
import { _listPatient } from "./patient";
import { _listService } from "./service";

const ROOT = "agendamentos/";

export const _listScheduling: Agendamento[] = [
    {
        idAgendamento: 1,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "13:00:00",
        status: ScheduleStatusEnum.Progress,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0]
    },
    {
        idAgendamento: 2,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "13:00:00",
        status: ScheduleStatusEnum.Scheduled,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0]
    },
    {
        idAgendamento: 3,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "13:00:00",
        status: ScheduleStatusEnum.Scheduled,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0]
    },
    {
        idAgendamento: 4,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "13:00:00",
        status: ScheduleStatusEnum.Scheduled,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0]
    },
];

export const getSchedulingByIdHttp = async (id: number): Promise<Agendamento | undefined> => {
    // TODO: integração API
    return _listScheduling[0];
}

type ListReceptionistSchedulingByParams = {
    cpf: string | null;
    status: number | null;
}

export const listReceptionistSchedulingByParamsHttp = async (paramsData: ListReceptionistSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListReceptionistSchedulingByParams, Agendamento[]>(ROOT + "listar-por-cpf-e-status", paramsData);
    return data;
}

type ListDoctorSchedulingByParams = {
    funcionarioId: number;
    periodo: number;
}

export const listDoctorSchedulingByParamsHttp = async (paramsData: ListDoctorSchedulingByParams): Promise<Agendamento[]> => {
    // TODO: integração API
    return _listScheduling;
}

type PostSchedulingRequest = {
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

export const putSchedulingHttp = async (requestData: Agendamento): Promise<void> => {
    await put<Agendamento, void>(ROOT, requestData);
}
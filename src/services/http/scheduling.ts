import { getParams, post, put } from "../api";
import Agendamento from "../entities/agendamento";
import ScheduleStatusEnum from "../enums/scheduleStatus";

import { _listDoctor } from "./doctor";
import { _listEmployee } from "./employee";
import { _listPatient } from "./patient";
import { _listService } from "./service";

const ROOT = "agendamentos/";

export const _listScheduling: Agendamento[] = [
    {
        idAgendamento: 1,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "10:00:00",
        status: ScheduleStatusEnum.Scheduled,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0],
        recepcionista: _listEmployee[1]
    },
    {
        idAgendamento: 2,
        data: "2022-05-09",
        dataAgendada: "2022-05-13",
        horaAgendada: "14:00:00",
        status: ScheduleStatusEnum.Scheduled,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[2],
        recepcionista: _listEmployee[1]
    },
    {
        idAgendamento: 3,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "10:00:00",
        status: ScheduleStatusEnum.Progress,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0],
        recepcionista: _listEmployee[1]
    },
    {
        idAgendamento: 4,
        data: "2022-05-03",
        dataAgendada: "2022-05-03",
        horaAgendada: "10:00:00",
        status: ScheduleStatusEnum.Concluded,
        medico: _listDoctor[0],
        paciente: _listPatient[0],
        servico: _listService[0],
        recepcionista: _listEmployee[1]
    },
];

export const getSchedulingByIdHttp = async (id: number): Promise<Agendamento | undefined> => {
    // TODO: integração API
    _listScheduling[0].idAgendamento = id;
    return _listScheduling[0];
}

interface ListReceptionistSchedulingByParams {
    cpf: string | null;
    status: number | null;
}

export const listReceptionistSchedulingByParamsHttp = async (paramsData: ListReceptionistSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListReceptionistSchedulingByParams, Agendamento[]>(ROOT + "listar-por-cpf-e-status", paramsData);
    return data;
}

interface ListDoctorSchedulingByParams {
    funcionarioId: number;
    periodo: number;
}

export const listDoctorSchedulingByParamsHttp = async (paramsData: ListDoctorSchedulingByParams): Promise<Agendamento[]> => {
    // TODO: Integração API
    return await listReceptionistSchedulingByParamsHttp({status: 3, cpf: ""});
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

export const putSchedulingHttp = async (requestData: Agendamento): Promise<void> => {
    await put<Agendamento, void>(ROOT, requestData);
}
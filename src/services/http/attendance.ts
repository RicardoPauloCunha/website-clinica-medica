import { get, post } from "../api";

import Atendimento from "../entities/atendimento";

const ROOT = "atendimentos/";

export const listAttendanceByCpfHttp = async (cpf: string): Promise<Atendimento[]> => {
    let { data } = await get<Atendimento[]>(ROOT + "listar-por-cpf-paciente/" + cpf);
    return data;
}

interface PostAttendanceRequest {
    observacoes: string;
    diagnostico: string;
    agendamento: {
        idAgendamento: number;
    }
}

export const postAttendanceHttp = async (requestData: PostAttendanceRequest): Promise<void> => {
    await post<PostAttendanceRequest, void>(ROOT, requestData);
}
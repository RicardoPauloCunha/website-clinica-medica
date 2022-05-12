import { get, post } from "../api";
import Agendamento from "../entities/agendamento";
import Atendimento from "../entities/atendimento";

import { _listScheduling } from "./scheduling";

const ROOT = "atendimentos/";

export const _listAttendance: Atendimento[] = [
    {
        idAtendimento: 1,
        data: "2022-05-03",
        observacoes: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos.",
        diagnostico: "Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.",
        agendamento: _listScheduling[0]
    },
    {
        idAtendimento: 2,
        data: "2022-05-03",
        observacoes: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação.",
        diagnostico: "Quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.",
        agendamento: _listScheduling[1]
    }
];

export const listAttendanceByCpfHttp = async (cpf: string): Promise<Atendimento[]> => {
    let { data } = await get<Atendimento[]>(ROOT + "listar-por-cpf-paciente/" + cpf);
    return data;
}

interface PostAttendanceRequest {
    observacoes: string;
    diagnostico: string;
    agendamento: Agendamento;
}

export const postAttendanceHttp = async (requestData: PostAttendanceRequest): Promise<void> => {
    await post<PostAttendanceRequest, void>(ROOT, requestData);
}
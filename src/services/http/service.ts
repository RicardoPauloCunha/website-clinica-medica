import { get, getParams, post, put } from "../api";
import Servico from "../entities/servico";
import { _listSpecialty } from "./specialty";

const ROOT = "servicos/";

export const _listService: Servico[] = [
    {
        idServico: 1,
        nomeServico: "Consulta especializada",
        valor: 100,
        descricaoServico: "Consultas especializadas por área, como cardiologia, neurologia, pediatria, ortopedia, ginecologia e outros",
        especialidade: _listSpecialty[0]
    },
    {
        idServico: 2,
        nomeServico: "Exame básico",
        valor: 110,
        descricaoServico: "Exames realizados internamente, permitindo que o paciente tenha mais facilidade e agilidade na realização das solicitações médicas.",
        especialidade: _listSpecialty[0]
    },
    {
        idServico: 3,
        nomeServico: "Procedimentos simples com ou sem anestesia local",
        valor: 120,
        descricaoServico: "Procedimentos básicos internos para dar agilidade e eficiência ao atendimento médico.",
        especialidade: _listSpecialty[0]
    }
];

export const getServiceByIdHttp = async (serviceId: number): Promise<Servico> => {
    let { data } = await get<Servico>(ROOT + serviceId);
    return data;
}

export const listServiceHttp = async (): Promise<Servico[]> => {
    let { data } = await get<Servico[]>(ROOT);
    return data;
}

interface ListServiceByParams {
    id: number | null;
}

export const listServiceByParamsHttp = async (paramsData: ListServiceByParams): Promise<Servico[]> => {
    let { data } = await getParams<ListServiceByParams, Servico[]>(ROOT + "listar-por-id-especialidade", paramsData);
    return data;
}

interface PostServiceRequest {
    nomeServico: string;
    valor: number;
    descricaoServico: string;
    especialidade: {
        idEspecialidade: number;
    }
}

export const postServiceHttp = async (requestData: PostServiceRequest): Promise<void> => {
    await post<PostServiceRequest, void>(ROOT, requestData);
}

interface PutServiceRequest extends PostServiceRequest {
    idServico: number;
}

export const putServiceHttp = async (requestData: PutServiceRequest): Promise<void> => {
    await put<PostServiceRequest, void>(ROOT + requestData.idServico, requestData);
}
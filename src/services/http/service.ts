import { get, getParams, post, put } from "../api";
import Servico from "../entities/servico";

const ROOT = "servicos/";

export const getServiceByIdHttp = async (serviceId: number): Promise<Servico> => {
    let { data } = await get<Servico>(ROOT + serviceId);
    return data;
}

export const listServiceHttp = async (): Promise<Servico[]> => {
    let { data } = await get<Servico[]>(ROOT);
    return data;
}

interface ListServiceByParams {
    id: number | undefined;
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
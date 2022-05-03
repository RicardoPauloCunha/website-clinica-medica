import { get, post } from "../api";
import Servico from "../entities/servico";

const ROOT = "servicos/";

export const _listService: Servico[] = [
    {
        idServico: 1,
        nomeServico: "Consulta especializada",
        valor: 100.00,
        descricaoServico: "Consultas especializadas por área, como cardiologia, neurologia, pediatria, ortopedia, ginecologia e outros"
    },
    {
        idServico: 2,
        nomeServico: "Exame básico",
        valor: 110.00,
        descricaoServico: "Exames realizados internamente, permitindo que o paciente tenha mais facilidade e agilidade na realização das solicitações médicas."
    },
    {
        idServico: 3,
        nomeServico: "Procedimentos simples com ou sem anestesia local",
        valor: 120.00,
        descricaoServico: "Procedimentos básicos internos para dar agilidade e eficiência ao atendimento médico."
    }
];

export const listServiceHttp = async (): Promise<Servico[]> => {
    let { data } = await get<Servico[]>(ROOT);
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
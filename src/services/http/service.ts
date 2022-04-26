import { SuccessResponse } from "../defaultEntities";
import Servico from "../entities/servico";

export const _listService: Servico[] = [
    {
        idServico: 1,
        nome: "Consulta especializada",
        valor: 100.00,
        descricao: "Consultas especializadas por área, como cardiologia, neurologia, pediatria, ortopedia, ginecologia e outros"
    },
    {
        idServico: 2,
        nome: "Exame básico",
        valor: 110.00,
        descricao: "Exames realizados internamente, permitindo que o paciente tenha mais facilidade e agilidade na realização das solicitações médicas."
    },
    {
        idServico: 3,
        nome: "Procedimentos simples com ou sem anestesia local",
        valor: 120.00,
        descricao: "Procedimentos básicos internos para dar agilidade e eficiência ao atendimento médico."
    }
];

export const listServiceHttp = async (): Promise<Servico[]> => {
    return _listService;
}

export const postServiceHttp = async (requestData: Servico): Promise<SuccessResponse> => {
    return { message: "" };
}
import { get, post, put } from "../api";
import Clinica from "../entities/Clinica";

const ROOT = "clinica/";

export const _listClinic: Clinica[] = [
    {
        idClinica: 1,
        nome: "Clínica Médica",
        cnpj: "01234573000164",
        endereco: "Avenida Guarani, 303, Vila Coqueiro - Valinhos/SP - 13276-040",
        inscricaoMunicipal: "0123456789",
        atividade: "4.03 - Hospitais, clínicas, laboratórios, sanatórios, manicômios, casas de saúde, prontos-socorros, ambulatórios e congêneres."
    }
];

export const getCurrentClinicHttp = async (): Promise<Clinica> => {
    let { data } = await get<Clinica>(ROOT + 1);
    return data;
}

interface PostClinicHttp {
    nome: string;
    cnpj: string;
    endereco: string;
    inscricaoMunicipal: string;
    atividade: string;
}

export const postClinicHttp = async (requestData: PostClinicHttp): Promise<void> => {
    let { data } = await post<PostClinicHttp, void>(ROOT, requestData);
    return data;
}

interface PutClinicHttp extends PostClinicHttp {
    idClinica: number;
}

export const putClinicHttp = async (requestData: PutClinicHttp): Promise<void> => {
    let { data } = await put<PutClinicHttp, void>(ROOT, requestData);
    return data;
}
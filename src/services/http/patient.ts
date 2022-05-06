import { getParams, post } from "../api";
import Paciente from "../entities/paciente";
import GenderTypeEnum from "../enums/genderType";

const ROOT = "pacientes/";

export const _listPatient: Paciente[] = [
    {
        cpf: "41171694407",
        nome: "João César Carvalho",
        dataNascimento: "1975-01-01",
        sexo: GenderTypeEnum.Masculine,
        endereco: "Avenida Guarani, 303, Vila Coqueiro - Valinhos/SP - 13276-040",
        contato: "19997998191",
    },
    {
        cpf: "01751129837",
        nome: "Kaique Diogo Mateus da Costa",
        dataNascimento: "1982-04-03",
        sexo: GenderTypeEnum.Masculine,
        endereco: "Rua Doutor Aldo Cariani, 961, Vila Santana - Araraquara/SP - 14801-488",
        contato: "16984479923",
    },
    {
        cpf: "25183524815",
        nome: "Antônia Lívia Nascimento",
        dataNascimento: "1987-01-19",
        sexo: GenderTypeEnum.Feminine,
        endereco: "Rua Manoel da Silva, 577, Jussara - Araçatuba/SP - 16021-330",
        contato: "18981905136",
    },
    {
        cpf: "36316783809",
        nome: "Marlene Stefany Fernandes",
        dataNascimento: "1954-01-20",
        sexo: GenderTypeEnum.Feminine,
        endereco: "Avenida Armando Padredi, 294, Jardim Paraíso - Avaré/SP - 18702-582",
        contato: "14982652872",
    },
];

type SearchPatientParams = {
    cpf: string;
}

export const getPatientByCpfHttp = async (paramsData: SearchPatientParams): Promise<Paciente[]> => {
    let { data } = await getParams<SearchPatientParams, Paciente[]>(ROOT, paramsData);
    return data;
}

type PostPatientRequest = {
    cpf: string;
    nome: string;
    dataNascimento: string;
    sexo: number;
    endereco: string;
    contato: string;
}

export const postPatientHttp = async (requestData: PostPatientRequest): Promise<Paciente> => {
    let { data } = await post<PostPatientRequest, Paciente>(ROOT, requestData);
    return data;
}
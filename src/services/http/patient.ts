import Paciente from "../entities/paciente";
import { getEnumGenderType } from "../enums/genderType";

export const _listPatient: Paciente[] = [
    {
        cpf: "411.716.944-07",
        nome: "João César Carvalho",
        dataNascimento: "01/01/1975",
        sexo: getEnumGenderType("masculine"),
        endereco: "Avenida Guarani, 303, Vila Coqueiro - Valinhos/SP - 13276-040",
        contato: "(19) 99799-8191",
    },
    {
        cpf: "017.511.298-37",
        nome: "Kaique Diogo Mateus da Costa",
        dataNascimento: "03/04/1982",
        sexo: getEnumGenderType("masculine"),
        endereco: "Rua Doutor Aldo Cariani, 961, Vila Santana - Araraquara/SP - 14801-488",
        contato: "(16) 98447-9923",
    },
    {
        cpf: "251.835.248-15",
        nome: "Antônia Lívia Nascimento",
        dataNascimento: "19/01/1987",
        sexo: getEnumGenderType("feminine"),
        endereco: "Rua Manoel da Silva, 577, Jussara - Araçatuba/SP - 16021-330",
        contato: "(18) 98190-5136",
    },
    {
        cpf: "363.167.838-09",
        nome: "Marlene Stefany Fernandes",
        dataNascimento: "20/01/1954",
        sexo: getEnumGenderType("feminine"),
        endereco: "Avenida Armando Padredi, 294, Jardim Paraíso - Avaré/SP - 18702-582",
        contato: "(14) 98265-2872",
    },
];

export const getPatientByCpfHttp = async (cpf: string): Promise<Paciente | undefined> => {
    return _listPatient.find(x => x.cpf === cpf);
}
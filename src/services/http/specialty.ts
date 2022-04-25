import Especialidade from "../entities/especialidade";

export const _listSpecialty: Especialidade[] = [
    {
        idEspecialidade: 1,
        nome: "Clínica Médica"
    },
    {
        idEspecialidade: 2,
        nome: "Cirurgia Geral"
    },
    {
        idEspecialidade: 3,
        nome: "Pediatria"
    },
    {
        idEspecialidade: 4,
        nome: "Ginecologia"
    },
    {
        idEspecialidade: 5,
        nome: "Traumatologia"
    },
    {
        idEspecialidade: 6,
        nome: "Oftalmologia"
    },
    {
        idEspecialidade: 7,
        nome: "Cardiologia"
    },
    {
        idEspecialidade: 8,
        nome: "Dermatologia"
    },
    {
        idEspecialidade: 9,
        nome: "Psiquiatria"
    },
    {
        idEspecialidade: 10,
        nome: "Infectologia"
    }
];

export const listSpecialtyHttp = async (): Promise<Especialidade[]> => {
    return _listSpecialty;
}
import { SuccessResponse } from '../defaultEntities';
import Funcionario from '../entities/funcionario';
import { getEnumEmployeeType } from '../enums/employeeType';

export const _listEmployee: Funcionario[] = [
    {
        idFuncionario: 1,
        nome: "Administrador",
        email: "admin@cm.com",
        senha: "147852369",
        setor: "Gestão",
        tipoFuncionario: getEnumEmployeeType("admin")
    },
    {
        idFuncionario: 2,
        nome: "Recepcionista",
        email: "recep@cm.com",
        senha: "147852369",
        setor: "Recepção",
        tipoFuncionario: getEnumEmployeeType("receptionist")
    },
    {
        idFuncionario: 3,
        nome: "Médico",
        email: "medic@cm.com",
        senha: "147852369",
        setor: "Atendimento",
        tipoFuncionario: getEnumEmployeeType("doctor")
    },
    {
        idFuncionario: 4,
        nome: "Estoquista",
        email: "estoq@cm.com",
        senha: "147852369",
        setor: "Almoxarifado",
        tipoFuncionario: getEnumEmployeeType("stockist")
    }
];

export const getEmployeeByIdHttp = async (id: number): Promise<Funcionario | undefined> => {
    return _listEmployee.find(x => x.idFuncionario === id);
}

export const listEmployeeByTypeHttp = async (type: number): Promise<Funcionario[]> => {
    if (type === 0)
        return _listEmployee;
    else
        return _listEmployee.filter(x => x.tipoFuncionario === type);
}

type LoginRequest = {
    email: string;
    senha: string;
}

export const postLoginEmployeeHttp = async (requestData: LoginRequest): Promise<Funcionario | undefined> => {
    return _listEmployee.find(x => x.email === requestData.email && x.senha === requestData.senha);
}

export const postEmployeeHttp = async (requestData: Funcionario): Promise<SuccessResponse> => {
    return { message: "" };
}

export const putEmployeeHttp = async (requestData: Funcionario): Promise<SuccessResponse> => {
    return { message: "" };
}
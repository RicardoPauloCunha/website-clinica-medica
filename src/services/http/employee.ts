import { get, post } from '../api';
import { SuccessResponse } from '../defaultEntities';
import Funcionario from '../entities/funcionario';
import { getEnumEmployeeStatus } from '../enums/employeeStatus';
import { getEnumEmployeeType } from '../enums/employeeType';

const ROOT = "funcionarios/";

export const _listEmployee: Funcionario[] = [
    {
        idFuncionario: 1,
        nomeFuncionario: "Administrador",
        email: "admin@cm.com",
        senha: "147852369",
        setor: "Gestão",
        tipoFuncionario: getEnumEmployeeType("admin"),
        statusFuncionario: getEnumEmployeeStatus("enabled")
    },
    {
        idFuncionario: 2,
        nomeFuncionario: "Recepcionista",
        email: "recep@cm.com",
        senha: "147852369",
        setor: "Recepção",
        tipoFuncionario: getEnumEmployeeType("receptionist"),
        statusFuncionario: getEnumEmployeeStatus("enabled")
    },
    {
        idFuncionario: 3,
        nomeFuncionario: "Médico",
        email: "medic@cm.com",
        senha: "147852369",
        setor: "Atendimento",
        tipoFuncionario: getEnumEmployeeType("doctor"),
        statusFuncionario: getEnumEmployeeStatus("enabled")
    },
    {
        idFuncionario: 4,
        nomeFuncionario: "Estoquista",
        email: "estoq@cm.com",
        senha: "147852369",
        setor: "Almoxarifado",
        tipoFuncionario: getEnumEmployeeType("stockist"),
        statusFuncionario: getEnumEmployeeStatus("enabled")
    }
];

export const getEmployeeByIdHttp = async (employeeId: number): Promise<Funcionario> => {
    let { data } = await get<Funcionario>(ROOT + employeeId);
    return data;
}

export const listEmployeeByTypeHttp = async (type: number): Promise<Funcionario[]> => {
    if (type === 0)
        return _listEmployee;
    else
        return _listEmployee.filter(x => x.tipoFuncionario === type);
}

interface LoginRequest {
    email: string;
    senha: string;
}

export const postLoginEmployeeHttp = async (requestData: LoginRequest): Promise<Funcionario> => {
    let { data } = await post<LoginRequest, Funcionario>(ROOT + "login", requestData);
    return data;
}

export const postEmployeeHttp = async (requestData: Funcionario): Promise<SuccessResponse> => {
    return { message: "" };
}

export const putEmployeeHttp = async (requestData: Funcionario): Promise<SuccessResponse> => {
    return { message: "" };
}
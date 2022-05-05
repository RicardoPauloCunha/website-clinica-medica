import { get, getParams, post, put } from '../api';
import Funcionario from '../entities/funcionario';
import EmployeeStatusEnum from '../enums/employeeStatus';
import EmployeeTypeEnum from '../enums/employeeType';

const ROOT = "funcionarios/";

export const _listEmployee: Funcionario[] = [
    {
        idFuncionario: 1,
        nomeFuncionario: "Administrador",
        email: "admin@cm.com",
        senha: "147852369",
        setor: "Gestão",
        tipoFuncionario: EmployeeTypeEnum.Admin,
        statusFuncionario: EmployeeStatusEnum.Enabled
    },
    {
        idFuncionario: 2,
        nomeFuncionario: "Recepcionista",
        email: "recep@cm.com",
        senha: "147852369",
        setor: "Recepção",
        tipoFuncionario: EmployeeTypeEnum.Receptionist,
        statusFuncionario: EmployeeStatusEnum.Enabled
    },
    {
        idFuncionario: 3,
        nomeFuncionario: "Estoquista",
        email: "estoq@cm.com",
        senha: "147852369",
        setor: "Almoxarifado",
        tipoFuncionario: EmployeeTypeEnum.Stockist,
        statusFuncionario: EmployeeStatusEnum.Enabled
    },
    {
        idFuncionario: 4,
        nomeFuncionario: "Médico",
        email: "medic@cm.com",
        senha: "147852369",
        setor: "Atendimento",
        tipoFuncionario: EmployeeTypeEnum.Doctor,
        statusFuncionario: EmployeeStatusEnum.Enabled
    }
];

export const getEmployeeByIdHttp = async (employeeId: number): Promise<Funcionario> => {
    let { data } = await get<Funcionario>(ROOT + employeeId);
    return data;
}

interface FilterEmployeeParams {
    tipoFuncionario: number | null;
}

export const listEmployeeByTypeHttp = async (paramsData: FilterEmployeeParams): Promise<Funcionario[]> => {
    let { data } = await getParams<FilterEmployeeParams, Funcionario[]>(ROOT + "tipofuncionario", paramsData);
    return data;
}

interface LoginRequest {
    email: string;
    senha: string;
}

export const postLoginEmployeeHttp = async (requestData: LoginRequest): Promise<Funcionario> => {
    let { data } = await post<LoginRequest, Funcionario>(ROOT + "login", requestData);
    return data;
}

export interface PostEmployeeRequest {
    nomeFuncionario: string;
    email: string;
    senha: string;
    setor: string;
    tipoFuncionario: number;
    statusFuncionario: number;
}

export const postEmployeeHttp = async (requestData: PostEmployeeRequest): Promise<void> => {
    await post<PostEmployeeRequest, void>(ROOT, requestData);
}

interface PutEmployeeRequest extends PostEmployeeRequest {
    idFuncionario: number;
}

export const putEmployeeHttp = async (requestData: PutEmployeeRequest): Promise<void> => {
    await put<PutEmployeeRequest, void>(ROOT + "alterar-funcionario", requestData);
}
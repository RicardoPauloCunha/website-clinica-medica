import { get, getParams, post, put } from '../api';

import Funcionario from '../entities/funcionario';
import EmployeeTypeEnum from '../enums/employeeType';

const ROOT = "funcionarios/";

export const getEmployeeByIdHttp = async (employeeId: number): Promise<Funcionario> => {
    let { data } = await get<Funcionario>(ROOT + employeeId);
    return data;
}

interface ListEmployeeByParams {
    tipoFuncionario: EmployeeTypeEnum;
}

export const listEmployeeByParamsHttp = async (paramsData: ListEmployeeByParams): Promise<Funcionario[]> => {
    let { data } = await getParams<ListEmployeeByParams, Funcionario[]>(ROOT + "tipofuncionario", paramsData);
    return data;
}

interface PostLoginEmployeeRequest {
    email: string;
    senha: string;
}

export const postLoginEmployeeHttp = async (requestData: PostLoginEmployeeRequest): Promise<Funcionario> => {
    let { data } = await post<PostLoginEmployeeRequest, Funcionario>(ROOT + "login", requestData);
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
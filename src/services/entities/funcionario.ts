import EmployeeStatusEnum from "../enums/employeeStatus";
import EmployeeTypeEnum from "../enums/employeeType";

interface Funcionario {
    idFuncionario: number;
    nomeFuncionario: string;
    email: string;
    senha: string;
    setor: string;
    tipoFuncionario: EmployeeTypeEnum;
    statusFuncionario: EmployeeStatusEnum;
}

export default Funcionario;
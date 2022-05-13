import { useEffect, useState } from "react";

import Funcionario from "../../services/entities/funcionario";
import { listEmployeeType } from "../../services/enums/employeeType";
import { listEmployeeByParamsHttp } from "../../services/http/employee";
import { WarningTuple } from "../../util/getHttpErrors";

import { Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import EmployeeCard from "../../components/DataCard/employee";

const Employees = () => {
    const _employeeTypes = listEmployeeType();

    const [isLoading, setIsLoading] = useState<"get" | "status" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [employees, setEmployees] = useState<Funcionario[]>([]);

    useEffect(() => {
        getEmployees(0);
    }, []);

    const getEmployees = (employeeType: number) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listEmployeeByParamsHttp({
            tipoFuncionario: employeeType
        }).then(response => {
            setEmployees([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum funcionário foi encontrado."]);

            setIsLoading("");
        });
    }

    const handlerChangeEmployeeType = (optionValue: string) => {
        let employeeType = Number(optionValue);
        getEmployees(employeeType);
    }

    return (
        <>
            <h1>Lista de funcionários</h1>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='employeeType'
                    label='Tipo de funcionário'
                    placeholder='Filtrar pelo tipo de funcionário'
                    options={_employeeTypes.map((x, index) => ({
                        value: `${index + 1}`,
                        label: x
                    }))}
                    handlerChange={handlerChangeEmployeeType}
                />

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {employees.map((x, index) => (
                <EmployeeCard
                    key={x.idFuncionario}
                    id={x.idFuncionario}
                    name={x.nomeFuncionario}
                    email={x.email}
                    sector={x.setor}
                    employeeType={x.tipoFuncionario}
                    employeeStatus={x.statusFuncionario}
                />
            ))}
        </>
    );
}

export default Employees;
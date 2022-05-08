import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Funcionario from "../../services/entities/funcionario";
import EmployeeTypeEnum, { getValueEmployeeType, listEmployeeType } from "../../services/enums/employeeType";
import EmployeeStatusEnum, { defineColorEmployeeStatus, getValueEmployeeStatus } from "../../services/enums/employeeStatus";
import { listEmployeeByTypeHttp, putEmployeeHttp } from "../../services/http/employee";
import { WarningTuple } from "../../util/getHttpErrors";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import LoadingButton from "../../components/LoadingButton";
import StatusBadge from "../../components/StatusBadge";

type ModalString = "status" | "";

const Employees = () => {
    const navigate = useNavigate();

    const _employeeTypes = listEmployeeType();

    const [isLoading, setIsLoading] = useState<"get" | "status" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const [employees, setEmployees] = useState<Funcionario[]>([]);
    const [employeeIndex, setEmployeeIndex] = useState(-1);
    const [employeeIsEnabled, setEmployeeIsEnabled] = useState(true);

    useEffect(() => {
        getEmployees(0);
    }, []);

    const getEmployees = (employeeType: number) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listEmployeeByTypeHttp({
            tipoFuncionario: employeeType
        }).then(response => {
            setEmployees([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum funcionário foi encontrado."]);

            setIsLoading("");
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const sendChangeStatus = () => {
        if (employeeIndex === -1)
            return;

        setIsLoading("status");

        if (employees[employeeIndex].statusFuncionario === EmployeeStatusEnum.Enabled)
            employees[employeeIndex].statusFuncionario = EmployeeStatusEnum.Disabled;
        else
            employees[employeeIndex].statusFuncionario = EmployeeStatusEnum.Enabled;

        putEmployeeHttp(employees[employeeIndex]).then(() => {
            setIsLoading("");
            toggleModal();
        });
    }

    const handlerChangeEmployeeType = (optionValue: string) => {
        let employeeType = Number(optionValue);
        getEmployees(employeeType);
    }

    const onClickEditData = (index: number) => {
        if (index === -1)
            return;

        if (employees[index].tipoFuncionario === EmployeeTypeEnum.Doctor)
            navigate("/funcionarios/medicos/" + employees[index].idFuncionario + "/editar");
        else
            navigate("/funcionarios/" + employees[index].idFuncionario + "/editar");
    }

    const onClickChangeStatus = (index: number) => {
        setEmployeeIndex(index);
        setEmployeeIsEnabled(employees[index].statusFuncionario === EmployeeStatusEnum.Enabled);
        toggleModal("status");
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
                    label='Tipo do funcionário'
                    placeholder='Filtrar pelo tipo do funcionário'
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
                <DataCard
                    key={x.idFuncionario}
                    title={x.nomeFuncionario}
                    subtitle={x.email}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Tipo funcionário"
                            value={getValueEmployeeType(x.tipoFuncionario)}
                        />

                        <DataText
                            label="Setor"
                            value={x.setor}
                        />

                        <StatusBadge
                            label="Status"
                            status={x.statusFuncionario}
                            value={getValueEmployeeStatus(x.statusFuncionario)}
                            defineColor={defineColorEmployeeStatus}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        <Button
                            color={x.statusFuncionario === EmployeeStatusEnum.Enabled ? "danger" : "success"}
                            outline
                            onClick={() => onClickChangeStatus(index)}
                        >
                            {x.statusFuncionario === EmployeeStatusEnum.Enabled ? "Desabilitar" : "Habilitar"}
                        </Button>

                        <Button
                            color="warning"
                            onClick={() => onClickEditData(index)}
                        >
                            Editar
                        </Button>
                    </ButtonGroupRow>
                </DataCard>
            ))}

            <DataModal
                isOpen={modal === "status"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    {employeeIsEnabled ? "Desabilitar" : "Habilitar"} funcionário
                </ModalHeader>

                {employees[employeeIndex] && <ModalBody>
                    Tem certeza que deseja {employeeIsEnabled ? "desabilitar" : "habilitar"} o funcionário <b>{employees[employeeIndex].nomeFuncionario}</b>?
                </ModalBody>}

                <ModalFooter>
                    <LoadingButton
                        text={employeeIsEnabled ? "Desabilitar" : "Habilitar"}
                        isLoading={isLoading === "status"}
                        color={employeeIsEnabled ? "danger" : "success"}
                        onClick={() => sendChangeStatus()}
                    />

                    <Button
                        color="dark"
                        outline
                        onClick={() => toggleModal()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Employees;
import { useEffect, useState } from "react";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import Funcionario from "../../services/entities/funcionario";
import { getValueEmployeeType, listEmployeeType } from "../../services/enums/employeeType";
import { listEmployeeByTypeHttp, putEmployeeHttp } from "../../services/http/employee";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import { WarningTuple } from "../../util/getHttpErrors";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { getEnumEmployeeStatus, getValueEmployeeStatus } from "../../services/enums/employeeStatus";
import { useNavigate } from "react-router-dom";

type ModalString = "status" | "";

const Employees = () => {
    const navigate = useNavigate();

    const _typesEmployee = listEmployeeType();

    const ENABLED_STATUS = getValueEmployeeStatus("enabled");

    const [isLoading, setIsLoading] = useState<"get" | "status" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const [employees, setEmployees] = useState<Funcionario[]>([]);
    const [employeeIndex, setEmployeeIndex] = useState(-1);
    const [employeeIsEnabled, setEmployeeIsEnabled] = useState(true);

    useEffect(() => {
        getEmployees(0);
    }, []);

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
    }

    const getEmployees = (employeeType: number) => {
        setIsLoading("get");
        setWarning(["", ""]);

        listEmployeeByTypeHttp(employeeType).then(response => {
            setEmployees([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum funcionário foi encontrado."]);

            setIsLoading("");
        });
    }

    const sendChangeStatus = () => {
        if (employeeIndex === -1)
            return;

        setIsLoading("status");
        let currentStatus = getValueEmployeeStatus(undefined, employees[employeeIndex].statusFuncionario);

        if (currentStatus === ENABLED_STATUS)
            employees[employeeIndex].statusFuncionario = getEnumEmployeeStatus("disabled");
        else
            employees[employeeIndex].statusFuncionario = getEnumEmployeeStatus("enabled");

        putEmployeeHttp(employees[employeeIndex]).then(() => {
            setIsLoading("");
            toggleModal();
        });
    }

    const handlerChangeEmployeeType = (optionValue: string) => {
        let employeeType = Number(optionValue) + 1;
        getEmployees(employeeType);
    }

    const onClickEditData = (index: number) => {
        if (index === -1)
            return;

        navigate("/funcionario/" + employees[index].idFuncionario + "/editar");
    }

    const onClickChangeStatus = (index: number) => {
        setEmployeeIndex(index);
        setEmployeeIsEnabled(getValueEmployeeStatus(undefined, employees[index].statusFuncionario) === ENABLED_STATUS);
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
                    name='employeeTypeIndex'
                    label='Tipo do funcionário'
                    placeholder='Filtrar pelo tipo do funcionário'
                    options={_typesEmployee.map((x, index) => ({
                        value: index.toString(),
                        label: x
                    }))}
                    handlerChange={handlerChangeEmployeeType}
                />

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {employees.map((x, index) => {
                let status = getValueEmployeeStatus(undefined, x.statusFuncionario);

                return (
                    <DataCard
                        key={x.idFuncionario}
                        title={x.nomeFuncionario}
                        subtitle={x.email}
                    >
                        <TextGroupGrid>
                            <DataText
                                label="Tipo funcionário"
                                value={getValueEmployeeType(undefined, x.tipoFuncionario)}
                            />

                            <DataText
                                label="Setor"
                                value={x.setor}
                            />

                            <DataText
                                label="Status"
                                value={status}
                            />
                        </TextGroupGrid>

                        <ButtonGroupRow>
                            <Button
                                color="warning"
                                outline
                                onClick={() => onClickEditData(index)}
                            >
                                Editar
                            </Button>

                            <Button
                                color={status === ENABLED_STATUS ? "danger" : "success"}
                                onClick={() => onClickChangeStatus(index)}
                            >
                                {status === ENABLED_STATUS ? "Desabilitar" : "Habilitar"}
                            </Button>
                        </ButtonGroupRow>
                    </DataCard>
                )
            })}

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
                    <Button
                        color={employeeIsEnabled ? "danger" : "success"}
                        onClick={() => sendChangeStatus()}
                    >
                        {isLoading === "status"
                            ? <Spinner size="sm" />
                            : employeeIsEnabled ? "Desabilitar" : "Habilitar"
                        }
                    </Button>

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Employees;
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import { getEnumEmployeeType, listEmployeeType } from "../../services/enums/employeeType";
import { getEnumEmployeeStatus } from "../../services/enums/employeeStatus";
import Especialidade from "../../services/entities/especialidade";
import Medico from "../../services/entities/medico";
import Funcionario from "../../services/entities/funcionario";
import { listSpecialtyHttp } from "../../services/http/specialty";
import { getEmployeeByIdHttp, postEmployeeHttp, putEmployeeHttp, _listEmployee } from "../../services/http/employee";
import { getDoctorByEmployeeIdHttp, postDoctorHttp, putDoctorHttp, _listDoctor } from "../../services/http/doctor";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

import { Button, Spinner } from "reactstrap";
import { Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";

interface EmployeeFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    sector: string;
    employeeType: number;
}

interface DoctorFormData extends EmployeeFormData {
    crm: string;
    specialtyId: number;
}

const RegisterEmployee = () => {
    const location = useLocation();
    const routeParams = useParams();
    const employeeFormRef = useRef<FormHandles>(null);
    const doctorFormRef = useRef<FormHandles>(null);

    const _itemEmployee = _listEmployee[1];
    const _itemDoctor = _listDoctor[0];
    const _employeeTypes = listEmployeeType();

    const DOCTOR_TYPE = getEnumEmployeeType("doctor");

    const [isLoading, setIsLoading] = useState<"register" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isDoctor, setIsDoctor] = useState(location.pathname.split("/")[1] === "medicos");
    const [isEdition, setIsEdition] = useState(routeParams.employeeId !== undefined || routeParams.doctorId !== undefined);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [editedEmployee, setEditedEmployee] = useState<Funcionario | undefined>(undefined);
    const [editedDoctor, setEditedDoctor] = useState<Medico | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);
        
        let pathIsDoctor = location.pathname.split("/")[2] === "medicos";
        setIsDoctor(pathIsDoctor);

        if (routeParams.employeeId !== undefined || routeParams.doctorId !== undefined) {
            setIsEdition(true);
        }
        else
        {
            setIsEdition(false);
            // employeeFormRef.current?.reset();
            // doctorFormRef.current?.reset();
            // TODO: Descomentar
        }

        if (routeParams.employeeId !== undefined)
            getEmployee();
        else if (routeParams.doctorId !== undefined)
            getDoctor();

        if (pathIsDoctor)
            getSpecialties();
        // eslint-disable-next-line
    }, [routeParams]);

    const getSpecialties = () => {
        listSpecialtyHttp().then(response => {
            setSpecialties([...response]);
        });
    }

    const getEmployee = () => {
        let id = Number(routeParams.employeeId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getEmployeeByIdHttp(id).then(response => {
            employeeFormRef.current?.setData({
                name: response.nomeFuncionario,
                email: response.email,
                password: response.senha,
                confirmPassword: response.senha,
                sector: response.setor,
                employeeType: response.tipoFuncionario.toString()
            });

            setEditedEmployee(response);
            setIsLoading("");
        });
    }

    const getDoctor = () => {
        let id = Number(routeParams.doctorId);
        if (isNaN(id))
            return;;

        setIsLoading("get");
        getDoctorByEmployeeIdHttp(id).then(response => {
            doctorFormRef.current?.setData({
                name: response.nomeFuncionario,
                email: response.email,
                password: response.senha,
                confirmPassword: response.senha,
                sector: response.setor,
                crm: response.crm,
                specialtyId: response.especialidade?.idEspecialidade.toString()
            });

            setEditedDoctor(response)
            setIsLoading("");
        });
    }

    const submitEmployeeForm: SubmitHandler<EmployeeFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            employeeFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do funcionário."),
                email: Yup.string().trim()
                    .required("Coloque o email do funcionário."),
                password: Yup.string().trim()
                    .required("Coloque a senha do funcionário."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                sector: Yup.string().trim()
                    .required("Coloque o setor do funcionário."),
                employeeType: Yup.string()
                    .required("Selecione o tipo do funcionário.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.employeeType = Number(data.employeeType);

            let employeeData = {
                nomeFuncionario: data.name,
                email: data.email,
                senha: data.password,
                setor: data.sector,
                tipoFuncionario: data.employeeType,
                statusFuncionario: getEnumEmployeeStatus("enabled")
            };

            if (editedEmployee === undefined) {
                await postEmployeeHttp(employeeData).then(() => {
                    setWarning(["success", "Funcionário cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o funcionário."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                employeeData.senha = editedEmployee.senha;
                employeeData.statusFuncionario = editedEmployee.statusFuncionario;

                await putEmployeeHttp({
                    idFuncionario: editedEmployee.idFuncionario,
                    ...employeeData
                }).then(() => {
                    setWarning(["success", "Funcionário editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o funcionário."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                employeeFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do funcionário inválidos."]);
            setIsLoading("");
        }
    }

    const submitDoctorForm: SubmitHandler<DoctorFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            doctorFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do médico."),
                email: Yup.string().trim()
                    .required("Coloque o email do médico."),
                password: Yup.string().trim()
                    .required("Coloque a senha do médico."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                sector: Yup.string().trim()
                    .required("Coloque o setor do médico."),
                crm: Yup.string().trim()
                    .required("Coloque o CRM do médico."),
                specialtyId: Yup.string()
                    .required("Selecione a especialidade do médico.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let doctorData = {
                nomeFuncionario: data.name,
                email: data.email,
                senha: data.password,
                setor: data.sector,
                tipoFuncionario: DOCTOR_TYPE,
                statusFuncionario: getEnumEmployeeStatus("enabled"),
                crm: data.crm,
                especialidade: {
                    idEspecialidade: Number(data.specialtyId)
                }
            };

            if (editedDoctor === undefined) {
                await postDoctorHttp(doctorData).then(() => {
                    setWarning(["success", "Médico cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                doctorData.senha = editedDoctor.senha;
                doctorData.statusFuncionario = editedDoctor.statusFuncionario;

                await putDoctorHttp({
                    idFuncionario: editedDoctor.idFuncionario,
                    ...doctorData
                }).then(() => {
                    setWarning(["success", "Médico editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                doctorFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do médico inválidos."]);
            setIsLoading("");
        }
    }

    return (
        <>
            {isEdition
                ? <h1>
                    Edição de {isDoctor ? "médico" : "funcionário"}

                    {isLoading === "get" && <>
                        {' '}
                        <Spinner
                            color="primary"
                            type="grow"
                        />
                    </>}
                </h1>
                : <h1>Cadastro de {isDoctor ? "médico" : "funcionário"}</h1>
            }

            <Form
                ref={isDoctor ? doctorFormRef : employeeFormRef}
                onSubmit={isDoctor ? submitDoctorForm : submitEmployeeForm}
                className="form-data"
                initialData={{
                    name: _itemEmployee.nomeFuncionario,
                    email: _itemEmployee.email,
                    password: _itemEmployee.senha,
                    confirmPassword: _itemEmployee.senha,
                    sector: _itemEmployee.setor,
                    crm: _itemDoctor.crm
                }}
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <FieldInput
                    name='email'
                    label='E-mail'
                    placeholder='Coloque o email'
                    type="email"
                />

                <FieldInput
                    name='password'
                    label='Senha'
                    placeholder='Coloque a senha'
                    type="password"
                />

                <FieldInput
                    name='confirmPassword'
                    label='Confirmar senha'
                    placeholder='Confirme a senha'
                    type="password"
                />

                <FieldInput
                    name='sector'
                    label='Setor'
                    placeholder='Coloque o setor'
                />

                {isDoctor
                    ? <>
                        <FieldInput
                            name='crm'
                            label='CRM'
                            placeholder='Coloque o CRM'
                        />

                        <SelectInput
                            name='specialtyId'
                            label='Especialidade do médico'
                            placeholder='Selecione a especialidade do médico'
                            options={specialties.map(x => ({
                                value: x.idEspecialidade?.toString(),
                                label: x.nomeEspecialidade
                            }))}
                        />
                    </>
                    : <SelectInput
                        name='employeeType'
                        label='Tipo do funcionário'
                        placeholder='Selecione o tipo do funcionário'
                        options={_employeeTypes.map((x, index) => ({
                            value: `${index + 1}`,
                            label: x
                        }))}
                    />
                }

                <Button
                    type='submit'
                >
                    {isLoading === "register"
                        ? <Spinner size="sm" />
                        : isEdition ? "Editar" : "Cadastrar"
                    }
                </Button>

                <Warning value={warning} />
            </Form>
        </>
    );
}

export default RegisterEmployee;
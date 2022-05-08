import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Especialidade from "../../services/entities/especialidade";
import Medico from "../../services/entities/medico";
import Funcionario from "../../services/entities/funcionario";
import EmployeeTypeEnum, { listToRegisterEmployeeType } from "../../services/enums/employeeType";
import EmployeeStatusEnum from "../../services/enums/employeeStatus";
import { listSpecialtyHttp } from "../../services/http/specialty";
import { getEmployeeByIdHttp, postEmployeeHttp, putEmployeeHttp, _listEmployee } from "../../services/http/employee";
import { getDoctorByEmployeeIdHttp, postDoctorHttp, putDoctorHttp, _listDoctor } from "../../services/http/doctor";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { normalize } from "../../util/formatString";

import { Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";
import ToggleTitle from "../../components/ToggleTitle";
import LoadingButton from "../../components/LoadingButton";

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

    const _itemEmployee = _listEmployee[2];
    const _itemDoctor = _listDoctor[0];
    const _employeeTypes = listToRegisterEmployeeType();

    const [isLoading, setIsLoading] = useState<"register" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isDoctor, setIsDoctor] = useState(location.pathname.split("/")[1] === "medicos");
    const [isEdition, setIsEdition] = useState(routeParams.employeeId !== undefined || routeParams.doctorId !== undefined);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [editedEmployee, setEditedEmployee] = useState<Funcionario | undefined>(undefined);
    const [editedDoctor, setEditedDoctor] = useState<Medico | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);

        if (routeParams.employeeId !== undefined) {
            setIsEdition(true);
            getEmployee();

        }
        else if (routeParams.doctorId !== undefined) {
            setIsEdition(true);
            getDoctor();
        }
        else {
            setIsEdition(false);
            // employeeFormRef.current?.reset();
            // doctorFormRef.current?.reset();
            // TODO: Descomentar
        }

        if (location.pathname.split("/")[2] === "medicos") {
            setIsDoctor(true);
            getSpecialties();
        }
        else {
            setIsDoctor(false);
        }
        // eslint-disable-next-line
    }, [routeParams]);

    useEffect(() => {
        if (!isDoctor && editedEmployee !== undefined) {
            setTimeout(() => {
                employeeFormRef.current?.setData({
                    name: editedEmployee.nomeFuncionario,
                    email: editedEmployee.email,
                    password: editedEmployee.senha,
                    confirmPassword: editedEmployee.senha,
                    sector: editedEmployee.setor,
                    employeeType: editedEmployee.tipoFuncionario.toString()
                });
            }, 100);
        }
        else if (isDoctor && specialties.length !== 0 && editedDoctor !== undefined) {
            setTimeout(() => {
                doctorFormRef.current?.setData({
                    name: editedDoctor.nomeFuncionario,
                    email: editedDoctor.email,
                    password: editedDoctor.senha,
                    confirmPassword: editedDoctor.senha,
                    sector: editedDoctor.setor,
                    crm: editedDoctor.crm,
                    specialtyId: editedDoctor.especialidade?.idEspecialidade.toString()
                });
            }, 100);
        }
    }, [isDoctor, specialties, editedEmployee, editedDoctor])

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
                statusFuncionario: EmployeeStatusEnum.Enabled
            };

            if (!isEdition) {
                await postEmployeeHttp(employeeData).then(() => {
                    setWarning(["success", "Funcionário cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o funcionário."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedEmployee !== undefined) {
                await putEmployeeHttp({
                    ...employeeData,
                    idFuncionario: editedEmployee.idFuncionario,
                    statusFuncionario: editedEmployee.statusFuncionario
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
                tipoFuncionario: EmployeeTypeEnum.Doctor,
                statusFuncionario: EmployeeStatusEnum.Enabled,
                crm: normalize(data.crm),
                especialidade: {
                    idEspecialidade: Number(data.specialtyId)
                }
            };

            if (!isEdition) {
                await postDoctorHttp(doctorData).then(() => {
                    setWarning(["success", "Médico cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedDoctor !== undefined) {
                await putDoctorHttp({
                    ...doctorData,
                    idFuncionario: editedDoctor.idFuncionario,
                    statusFuncionario: editedDoctor.statusFuncionario
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
            <ToggleTitle
                toggle={isEdition}
                isLoading={isLoading === "get"}
                title={`Cadastro de ${isDoctor ? "médico" : "funcionário"}`}
                alternateTitle={`Edição de ${isDoctor ? "médico" : "funcionário"}`}
            />

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

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "register"}
                    type='submit'
                    color={isEdition ? "warning" : "secondary"}
                />

                <Warning value={warning} />
            </Form>
        </>
    );
}

export default RegisterEmployee;
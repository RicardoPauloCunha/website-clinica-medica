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
import { getEmployeeByIdHttp, postEmployeeHttp, putEmployeeHttp } from "../../services/http/employee";
import { getDoctorByIdHttp, postDoctorHttp, putDoctorHttp } from "../../services/http/doctor";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import DocumentTitle from "../../util/documentTitle";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DataModal, Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";
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

type ModalString = "status" | "";

const RegisterEmployee = () => {
    const location = useLocation();
    const routeParams = useParams();
    const employeeFormRef = useRef<FormHandles>(null);
    const doctorFormRef = useRef<FormHandles>(null);

    const _employeeTypes = listToRegisterEmployeeType();

    const [isLoading, setIsLoading] = useState<"register" | "get" | "status" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [isDoctor, setIsDoctor] = useState(location.pathname.split("/")[1] === "medicos");
    const [isEdition, setIsEdition] = useState(routeParams.employeeId !== undefined || routeParams.doctorId !== undefined);
    const [isEnabled, setIsEnabled] = useState(false);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [editedEmployee, setEditedEmployee] = useState<Funcionario | undefined>(undefined);
    const [editedDoctor, setEditedDoctor] = useState<Medico | undefined>(undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);
        setModal("");
        setIsEnabled(false);
        setEditedDoctor(undefined);
        setEditedEmployee(undefined);

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
            employeeFormRef.current?.reset();
            doctorFormRef.current?.reset();
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
                    specialtyId: editedDoctor.especialidade.idEspecialidade.toString()
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
            setIsEnabled(response.statusFuncionario === EmployeeStatusEnum.Enabled);
            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Funcion??rio n??o encontrado."]);
        });
    }

    const getDoctor = () => {
        let id = Number(routeParams.doctorId);
        if (isNaN(id))
            return;;

        setIsLoading("get");
        getDoctorByIdHttp(id).then(response => {
            setEditedDoctor(response)
            setIsEnabled(response.statusFuncionario === EmployeeStatusEnum.Enabled);
            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "M??dico n??o encontrado."]);
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        if (typeof(modalName) === "string") {
            setModal(modalName);
            setWarning(["", ""]);
        }
        else {
            setModal("");
        }
    }

    const sendChangeStatus = () => {
        setIsLoading("status");
        if (!isDoctor && editedEmployee) {
            editedEmployee.statusFuncionario = editedEmployee.statusFuncionario === EmployeeStatusEnum.Enabled
                ? EmployeeStatusEnum.Disabled
                : EmployeeStatusEnum.Enabled;

            putEmployeeHttp(editedEmployee).then(() => {
                setWarning(["success", `Status do funcion??rio editado com sucesso.`]);
                setIsEnabled(editedEmployee.statusFuncionario === EmployeeStatusEnum.Enabled);
                toggleModal();
            }).catch(() => {
                setWarning(["danger", "N??o foi poss??vel editar o status do funcion??rio."]);
            }).finally(() => { setIsLoading(""); });
        }
        else if (editedDoctor) {
            editedDoctor.statusFuncionario = editedDoctor.statusFuncionario === EmployeeStatusEnum.Enabled
                ? EmployeeStatusEnum.Disabled
                : EmployeeStatusEnum.Enabled;

            putDoctorHttp(editedDoctor).then(() => {
                setWarning(["success", "Status do m??dico editado com sucesso."]);
                setIsEnabled(editedDoctor.statusFuncionario === EmployeeStatusEnum.Enabled);
                toggleModal();
            }).catch(() => {
                setWarning(["danger", "N??o foi poss??vel editar o status do m??dico."]);
            }).finally(() => { setIsLoading(""); });
        }
    }

    const submitEmployeeForm: SubmitHandler<EmployeeFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            employeeFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do funcion??rio."),
                email: Yup.string().trim()
                    .required("Coloque o email do funcion??rio."),
                password: Yup.string().trim()
                    .required("Coloque a senha do funcion??rio."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                sector: Yup.string().trim()
                    .required("Coloque o setor do funcion??rio."),
                employeeType: Yup.string()
                    .required("Selecione o tipo de funcion??rio.")
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
                    setWarning(["success", "Funcion??rio cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar o funcion??rio."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedEmployee !== undefined) {
                await putEmployeeHttp({
                    ...employeeData,
                    idFuncionario: editedEmployee.idFuncionario,
                    statusFuncionario: editedEmployee.statusFuncionario
                }).then(() => {
                    setWarning(["success", "Funcion??rio editado com sucesso."]);
                    editedEmployee.nomeFuncionario = data.name;
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar o funcion??rio."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                employeeFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do funcion??rio inv??lidos."]);
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
                    .required("Coloque o nome do m??dico."),
                email: Yup.string().trim()
                    .required("Coloque o email do m??dico."),
                password: Yup.string().trim()
                    .required("Coloque a senha do m??dico."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                sector: Yup.string().trim()
                    .required("Coloque o setor do m??dico."),
                crm: Yup.string().trim()
                    .required("Coloque o CRM do m??dico."),
                specialtyId: Yup.string()
                    .required("Selecione a especialidade do m??dico.")
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
                crm: data.crm,
                especialidade: {
                    idEspecialidade: Number(data.specialtyId)
                }
            };

            if (!isEdition) {
                await postDoctorHttp(doctorData).then(() => {
                    setWarning(["success", "M??dico cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar o m??dico."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedDoctor !== undefined) {
                await putDoctorHttp({
                    ...doctorData,
                    idFuncionario: editedDoctor.idFuncionario,
                    statusFuncionario: editedDoctor.statusFuncionario
                }).then(() => {
                    setWarning(["success", "M??dico editado com sucesso."]);
                    editedDoctor.nomeFuncionario = data.name;
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar o m??dico."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                doctorFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do m??dico inv??lidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} ${isDoctor ? "m??dico" : "funcion??rio"} | CM`);

    return (
        <>
            <h1>{isEdition ? `Edi????o de ${isDoctor ? "m??dico" : "funcion??rio"}` : `Cadastro de ${isDoctor ? "m??dico" : "funcion??rio"}`}</h1>

            <Form
                ref={isDoctor ? doctorFormRef : employeeFormRef}
                onSubmit={isDoctor ? submitDoctorForm : submitEmployeeForm}
                className="form-data"
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
                            label='Especialidade'
                            placeholder='Selecione a especialidade'
                            options={specialties.map(x => ({
                                value: x.idEspecialidade.toString(),
                                label: x.nomeEspecialidade
                            }))}
                        />
                    </>
                    : <SelectInput
                        name='employeeType'
                        label='Tipo de funcion??rio'
                        placeholder='Selecione o tipo de funcion??rio'
                        options={_employeeTypes.map((x, index) => ({
                            value: `${index + 1}`,
                            label: x
                        }))}
                        disabled={isEdition}
                    />
                }

                <Warning value={warning} />

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "register" || isLoading === "get"}
                    type='submit'
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>

            {isEdition && (editedDoctor || editedEmployee) && <>
                <h2>{isEnabled ? "Desabilitar" : "Habilitar"} {isDoctor ? "m??dico" : "funcion??rio"}</h2>
                <p>Voc?? pode {isEnabled ? "desabilitar" : "habilitar"} a conta do {isDoctor ? "m??dico" : "funcion??rio"} dentro do sistema.</p>

                <Button
                    color={isEnabled ? "danger" : "secondary"}
                    onClick={() => toggleModal("status")}
                >
                    {isEnabled ? "Desabilitar" : "Habilitar"} {isDoctor ? "m??dico" : "funcion??rio"}
                </Button>
            </>}

            <DataModal
                isOpen={modal === "status"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    {isEnabled ? "Desabilitar" : "Habilitar"} {isDoctor ? "m??dico" : "funcion??rio"}
                </ModalHeader>

                <ModalBody>
                    <p>
                        Tem certeza que deseja {isEnabled ? "desabilitar" : "habilitar"} o {isDoctor ? "m??dico " : "funcion??rio "}
                        <b>{isDoctor ? editedDoctor?.nomeFuncionario : editedEmployee?.nomeFuncionario}</b>?
                    </p>

                    <Warning value={warning} />
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text={isEnabled ? "Desabilitar" : "Habilitar"}
                        isLoading={isLoading === "status"}
                        color={isEnabled ? "danger" : "secondary"}
                        onClick={() => sendChangeStatus()}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default RegisterEmployee;
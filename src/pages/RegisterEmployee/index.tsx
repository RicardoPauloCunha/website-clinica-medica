import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { Button, Spinner } from "reactstrap";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import Especialidade from "../../services/entities/especialidade";
import { getValueEmployeeType, listEmployeeType } from "../../services/enums/employeeType";
import { listSpecialtyHttp } from "../../services/http/specialty";
import { Form } from "../../styles/components";
import { WarningTuple } from "../../util/getHttpErrors";
import * as Yup from 'yup';
import getValidationErrors from "../../util/getValidationErrors";
import FieldInput from "../../components/Input";
import { getEmployeeByIdHttp, postEmployeeHttp, putEmployeeHttp, _listEmployee } from "../../services/http/employee";
import { getDoctorByEmployeeIdHttp, postDoctorHttp, putDoctorHttp, _listDoctor } from "../../services/http/doctor";
import { useParams } from "react-router-dom";
import { getEnumEmployeeStatus } from "../../services/enums/employeeStatus";
import Medico from "../../services/entities/medico";
import Funcionario from "../../services/entities/funcionario";

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    sector: string;
    employeeTypeIndex: number;
}

type ComplementFormData = {
    crm: string;
    specialtyId: number;
}

const RegisterEmployee = () => {
    const routeParams = useParams();
    const registerFormRef = useRef<FormHandles>(null);
    const complementFormRef = useRef<FormHandles>(null);

    const _itemEmployee = _listEmployee[2];
    const _itemDoctor = _listDoctor[0];
    const _typesEmployee = listEmployeeType();

    const DOCTOR_TYPE = getValueEmployeeType("doctor");

    const [isLoading, setIsLoading] = useState<"register" | "getEmployee" | "getDoctor" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isDoctorType, setIsDoctorType] = useState(false);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [editedDoctor, setEditedDoctor] = useState<Medico | undefined>(undefined);

    useEffect(() => {
        if (routeParams.employeeId !== undefined)
            getEmployee()
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

        setIsLoading("getEmployee");
        getEmployeeByIdHttp(id).then(response => {
            if (response === undefined)
                return;

            let employeeTypeIndex = (response.idFuncionario as number) - 1;

            registerFormRef.current?.setData({
                name: response.nomeFuncionario,
                email: response.email,
                password: response.senha,
                confirmPassword: response.senha,
                sector: response.setor,
                employeeTypeIndex: employeeTypeIndex
            });

            handlerChangeEmployeeType(employeeTypeIndex.toString());

            if (getValueEmployeeType(undefined, response.idFuncionario) !== DOCTOR_TYPE) {
                setEditedDoctor({
                    crm: "",
                    ...response
                });
                setIsLoading("");
                return;
            }

            getDoctor(response.idFuncionario as number);
        });
    }

    const getDoctor = (employeeId: number) => {
        setIsLoading("getDoctor");
        getDoctorByEmployeeIdHttp(employeeId).then(response => {
            if (response === undefined)
                return;

            complementFormRef.current?.setData({
                crm: response.crm,
                specialtyId: response.especialidade?.idEspecialidade?.toString()
            });

            setEditedDoctor(response)
            setIsLoading("");
        });
    }

    const submitRegisterForm: SubmitHandler<RegisterFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            registerFormRef.current?.setErrors({});

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
                employeeTypeIndex: Yup.string()
                    .required("Selecione o tipo do funcionário.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.employeeTypeIndex = Number(data.employeeTypeIndex);

            let specialty: Especialidade | undefined = undefined;
            if (_typesEmployee[data.employeeTypeIndex] === DOCTOR_TYPE) {
                let specialtyId = Number(complementFormRef.current?.getFieldValue("specialtyId"));

                specialty = specialties.find(x => x.idEspecialidade === specialtyId);
                if (specialty === undefined) {
                    setWarning(["warning", "Especialidade do médico não encontrada."]);
                    return;
                }
            }

            if (editedDoctor === undefined) {
                let employee: Funcionario = {
                    idFuncionario: 0,
                    nomeFuncionario: data.name,
                    email: data.email,
                    senha: data.password,
                    setor: data.sector,
                    statusFuncionario: getEnumEmployeeStatus("enabled"),
                    tipoFuncionario: data.employeeTypeIndex + 1
                };

                if (_typesEmployee[data.employeeTypeIndex] !== DOCTOR_TYPE) {
                    await postEmployeeHttp(employee).then(() => {
                        setWarning(["success", "Funcionário criado com sucesso."]);
                        reset();
                    }).catch(() => {
                        setWarning(["danger", "Não foi possível criar o funcionário."]);
                    }).finally(() => { setIsLoading(""); });

                    return;
                }

                let crm = complementFormRef.current?.getFieldValue("crm") as string;

                await postDoctorHttp({
                    crm: crm,
                    especialidade: specialty,
                    ...employee
                }).then(() => {
                    setWarning(["success", "Médico criado com sucesso."]);
                    reset();
                    complementFormRef.current?.reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível criar o médico."]);
                }).finally(() => { setIsLoading(""); });

                return;
            }

            editedDoctor.nomeFuncionario = data.name;
            editedDoctor.email = data.email;
            editedDoctor.senha = data.password;
            editedDoctor.setor = data.sector;

            if (_typesEmployee[data.employeeTypeIndex] !== DOCTOR_TYPE) {
                await putEmployeeHttp(editedDoctor).then(() => {
                    setWarning(["success", "Funcionário editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o funcionário."]);
                }).finally(() => { setIsLoading(""); });

                return;
            }

            editedDoctor.especialidade = specialty;

            await putDoctorHttp(editedDoctor).then(() => {
                setWarning(["success", "Médico editado com sucesso."]);
            }).catch(() => {
                setWarning(["danger", "Não foi possível editar o médico."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                registerFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do funcionário inválidos."]);
            setIsLoading("");
        }
    }

    const submitComplementForm: SubmitHandler<ComplementFormData> = async (data) => {
        try {
            complementFormRef.current?.setErrors({});
            setWarning(["", ""]);

            const shema = Yup.object().shape({
                crm: Yup.string().trim()
                    .required("Coloque o CRM do médico."),
                specialtyId: Yup.string()
                    .required("Selecione a especialidade do médico.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            registerFormRef.current?.submitForm();
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                complementFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do médico inválidos."]);
        }
    }

    const handlerChangeEmployeeType = (optionValue: string) => {
        let index = Number(optionValue);
        let isDoctor = _typesEmployee[index] === DOCTOR_TYPE;
        setWarning(["", ""]);

        if (isDoctor && specialties.length === 0)
            getSpecialties();

        setIsDoctorType(isDoctor);
    }

    return (
        <>
            {routeParams.employeeId !== undefined
                ? <h1>
                    Edição de funcionário

                    {isLoading === "getEmployee" && <>
                        {' '}
                        <Spinner
                            color="primary"
                            type="grow"
                        />
                    </>}
                </h1>
                : <h1>Cadastro de funcionário</h1>
            }

            <Form
                ref={registerFormRef}
                onSubmit={submitRegisterForm}
                className="form-data"
                initialData={{
                    name: _itemEmployee.nomeFuncionario,
                    email: _itemEmployee.email,
                    password: _itemEmployee.senha,
                    confirmPassword: _itemEmployee.senha,
                    sector: _itemEmployee.setor,
                }}
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome do funcionário'
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
                    label='Setor do funcionário'
                    placeholder='Coloque o setor do funcionário'
                />

                <SelectInput
                    name='employeeTypeIndex'
                    label='Tipo do funcionário'
                    placeholder='Selecione o tipo do funcionário'
                    options={_typesEmployee.map((x, index) => ({
                        value: index.toString(),
                        label: x
                    }))}
                    handlerChange={handlerChangeEmployeeType}
                    disabled={editedDoctor !== undefined}
                />

                {!isDoctorType && <>
                    <Button
                        type='submit'
                    >
                        {isLoading === "register"
                            ? <Spinner size="sm" />
                            : editedDoctor ? "Editar" : "Cadastrar"
                        }
                    </Button>

                    <Warning value={warning} />
                </>}
            </Form>

            {isDoctorType && <>
                {editedDoctor
                    ? <h2>
                        Editar dados do médico

                        {isLoading === "getDoctor" && <>
                            {' '}
                            <Spinner
                                color="primary"
                                type="grow"
                            />
                        </>}
                    </h2>
                    : <h2>Complementar dados do médico</h2>
                }

                <Form
                    ref={complementFormRef}
                    onSubmit={submitComplementForm}
                    className="form-data"
                    initialData={{
                        crm: _itemDoctor.crm
                    }}
                >
                    <FieldInput
                        name='crm'
                        label='CRM do médico'
                        placeholder='Coloque o CRM do médico'
                        disabled={editedDoctor !== undefined}
                    />

                    <SelectInput
                        name='specialtyId'
                        label='Especialidade'
                        placeholder='Selecione a especialidade'
                        options={specialties.map(x => ({
                            value: x.idEspecialidade?.toString() as string,
                            label: x.nomeEspecialidade
                        }))}
                    />

                    <Button
                        type='submit'
                    >
                        {isLoading === "register"
                            ? <Spinner size="sm" />
                            : editedDoctor ? "Editar" : "Cadastrar"
                        }
                    </Button>

                    <Warning value={warning} />
                </Form>
            </>}
        </>
    );
}

export default RegisterEmployee;
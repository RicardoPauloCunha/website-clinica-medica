import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { Button, Spinner } from "reactstrap";
import FieldInput from "../../components/Input";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import Especialidade from "../../services/entities/especialidade";
import { listSpecialtyHttp } from "../../services/http/specialty";
import { Form } from "../../styles/components";
import { WarningTuple } from "../../util/getHttpErrors";
import * as Yup from 'yup';
import { postServiceHttp, _listService } from "../../services/http/service";
import getValidationErrors from "../../util/getValidationErrors";

type RegisterFormData = {
    name: string;
    price: number;
    description: string;
    specialtyId: number;
}

type AddFormData = {
    specialtyName: string
}

const RegisterService = () => {
    const registerFormRef = useRef<FormHandles>(null);
    const addFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"form" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [warnFor, setWarnFor] = useState<"form" | "add" | "">("");

    const selectedService = _listService[0];

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);

    useEffect(() => {
        getSpecialties();
        // eslint-disable-next-line
    }, []);

    const getSpecialties = () => {
        listSpecialtyHttp().then(response => {
            setSpecialties([...response]);
        });
    }

    const submitRegisterForm: SubmitHandler<RegisterFormData> = async (data, { reset }) => {
        try {
            setIsLoading("form");
            setWarnFor("form");
            registerFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string()
                    .trim()
                    .required("Coloque o nome do serviço."),
                price: Yup.number()
                    .moreThan(0, "Coloque o preço do serviço."),
                description: Yup.string()
                    .trim()
                    .required("Coloque a descrição do serviço."),
                specialtyId: Yup.string()
                    .required("Selecione a especialidade do serviço.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.specialtyId = Number(data.specialtyId);
            let specialty = specialties.find(x => x.idEspecialidade === data.specialtyId);

            if (specialty === undefined) {
                setWarning(["warning", "Especialidade não encontrada."]);
                return;
            }

            specialty.idEspecialidade = specialty.idEspecialidade > 0 ? specialty.idEspecialidade : 0;

            setTimeout(async () => {
                await postServiceHttp({
                    idServico: 0,
                    nome: data.name,
                    valor: data.price,
                    descricao: data.description,
                    especialidade: specialty
                }).then(() => {
                    setWarning(["success", "Serviço criado com sucesso."]);
                    reset();

                    if (specialty?.idEspecialidade === 0)
                        getSpecialties();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível criar o serviço."]);
                }).finally(() => { setIsLoading(""); });
            }, 1000);
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                registerFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos inválidos."]);
            setIsLoading("");
        }
    }

    const submitAddForm: SubmitHandler<AddFormData> = async (data, { reset }) => {
        try {
            setWarnFor("add");
            addFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                specialtyName: Yup.string()
                    .trim()
                    .required("Coloque o nome da especialidade."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let specialtyId = (specialties.length + 1) * -1;

            setSpecialties([...specialties, {
                idEspecialidade: specialtyId,
                nome: data.specialtyName
            }]);

            setTimeout(() => {
                registerFormRef.current?.setFieldValue("specialtyId", specialtyId.toString());
            }, 100);

            reset();
            setWarning(["success", "Especialidade adicionada e criada com sucesso."]);
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                addFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos inválidos."]);
        }
    }

    return (
        <>
            <h1>Cadastro de serviço</h1>

            <Form
                ref={registerFormRef}
                onSubmit={submitRegisterForm}
                className="form-data"
                initialData={{
                    name: selectedService.nome,
                    price: selectedService.valor.toFixed(2),
                    description: selectedService.descricao
                }}
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome do serviço'
                />

                <CurrencyInput
                    name='price'
                    label='Preço'
                />

                <FieldInput
                    name='description'
                    label='Descrição'
                    placeholder='Coloque a descrição do serviço'
                    type="textarea"
                />

                <SelectInput
                    name='specialtyId'
                    label='Selecionar especialidade'
                    placeholder='Selecione a especialidade'
                    options={specialties.map(x => ({
                        value: x.idEspecialidade.toString(),
                        label: x.nome
                    }))}
                />

                <Button
                    type='submit'
                >
                    {isLoading === "form"
                        ? <Spinner size="sm" />
                        : "Cadastrar"
                    }
                </Button>

                {warnFor === "form" && <Warning
                    value={warning}
                />}
            </Form>

            <h2>Adicionar especialidade</h2>
            <p>Você pode adicionar uma nova especialidade caso não tenha encontrado a opção desejada.</p>

            <Form
                ref={addFormRef}
                onSubmit={submitAddForm}
                className="form-data"
            >
                <FieldInput
                    name='specialtyName'
                    label='Nome'
                    placeholder='Coloque o nome da especialidade'
                />

                <Button
                    type='submit'
                >
                    Adicionar
                </Button>

                {warnFor === "add" && <Warning
                    value={warning}
                />}
            </Form>
        </>
    )
}

export default RegisterService;
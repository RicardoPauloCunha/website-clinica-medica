import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Especialidade from "../../services/entities/especialidade";
import { postServiceHttp, _listService } from "../../services/http/service";
import { listSpecialtyHttp, postSpecialtyHttp, _listSpecialty } from "../../services/http/specialty";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DataModal, Form } from "../../styles/components";
import FieldInput from "../../components/Input";
import CurrencyInput from "../../components/Input/currency";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import LoadingButton from "../../components/LoadingButton";

type ServiceFormData = {
    name: string;
    price: number;
    description: string;
    specialtyId: number;
}

type SpecialtyFormData = {
    name: string
}

type ModalString = "specialty" | "";

const RegisterService = () => {
    const serviceFormRef = useRef<FormHandles>(null);
    const specialtyFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"service" | "specialty" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const _itemService = _listService[0];
    const _itemSpecialty = _listSpecialty[0];

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

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const submitServiceForm: SubmitHandler<ServiceFormData> = async (data, { reset }) => {
        try {
            setIsLoading("service");
            setWarning(["", ""]);
            serviceFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do serviço."),
                price: Yup.number()
                    .moreThan(0, "Coloque o preço do serviço."),
                description: Yup.string().trim()
                    .required("Coloque a descrição do serviço."),
                specialtyId: Yup.string()
                    .required("Selecione a especialidade do serviço.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            await postServiceHttp({
                nomeServico: data.name,
                valor: data.price,
                descricaoServico: data.description,
                especialidade: { idEspecialidade: Number(data.specialtyId) }
            }).then(() => {
                setWarning(["success", "Serviço cadastrado com sucesso."]);
                reset();
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o serviço."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                serviceFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do serviço inválidos."]);
            setIsLoading("");
        }
    }

    const submitSpecialtyForm: SubmitHandler<SpecialtyFormData> = async (data, { reset }) => {
        try {
            setIsLoading("specialty");
            setWarning(["", ""]);
            specialtyFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome da especialidade."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            postSpecialtyHttp({
                nomeEspecialidade: data.name
            }).then(response => {
                toggleModal();
                setWarning(["success", "Especialidade adicionada e selecionada com sucesso."]);
                setSpecialties([...specialties, response]);
                reset();

                setTimeout(() => {
                    serviceFormRef.current?.setFieldValue("specialtyId", response.idEspecialidade.toString());
                }, 100);
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o serviço."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                specialtyFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos da especialidade inválidos."]);
            setIsLoading("");
        }
    }

    return (
        <>
            <h1>Cadastro de serviço</h1>

            <Form
                ref={serviceFormRef}
                onSubmit={submitServiceForm}
                className="form-data"
                initialData={{
                    name: _itemService.nomeServico,
                    price: _itemService.valor.toFixed(2),
                    description: _itemService.descricaoServico
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
                    rows="4"
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

                <LoadingButton
                    text="Cadastrar"
                    isLoading={isLoading === "service"}
                    type='submit'
                />

                {modal === "" && <Warning value={warning} />}
            </Form>

            <h2>Adicionar especialidade</h2>
            <p>Você pode adicionar uma nova especialidade caso não tenha encontrado a opção desejada.</p>

            <Button
                onClick={() => toggleModal("specialty")}
                outline
            >
                Adicionar especialidade
            </Button>

            <DataModal
                isOpen={modal === "specialty"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Adicionar especialidade
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={specialtyFormRef}
                        onSubmit={submitSpecialtyForm}
                        className="form-modal"
                        initialData={{
                            name: _itemSpecialty.nomeEspecialidade
                        }}
                    >
                        <FieldInput
                            name='name'
                            label='Nome da especialidade'
                            placeholder='Coloque o nome da especialidade'
                        />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    {modal === "" && <Warning value={warning} />}
                    <LoadingButton
                        text="Adicionar"
                        isLoading={isLoading === "specialty"}
                        type='button'
                        onClick={() => specialtyFormRef.current?.submitForm()}
                    />

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    )
}

export default RegisterService;
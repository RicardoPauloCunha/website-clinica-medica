import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Especialidade from "../../services/entities/especialidade";
import Servico from "../../services/entities/servico";
import { getServiceByIdHttp, postServiceHttp, putServiceHttp } from "../../services/http/service";
import { listSpecialtyHttp, postSpecialtyHttp, putSpecialtyHttp } from "../../services/http/specialty";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import DocumentTitle from "../../util/documentTitle";

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
    const routeParams = useParams();
    const serviceFormRef = useRef<FormHandles>(null);
    const specialtyFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"service" | "specialty" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [isEdition, setIsEdition] = useState(routeParams.materialId !== undefined);

    const [specialties, setSpecialties] = useState<Especialidade[]>([]);
    const [editedService, setEditedService] = useState<Servico | undefined>(undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);
        setModal("");
        setEditedService(undefined);

        if (routeParams.serviceId !== undefined) {
            setIsEdition(true);
            getService();
        }
        else {
            setIsEdition(false);
            serviceFormRef.current?.reset();
            specialtyFormRef.current?.reset();
        }

        getSpecialties();
        // eslint-disable-next-line
    }, [routeParams]);

    useEffect(() => {
        if (specialties.length !== 0 && editedService !== undefined) {
            setTimeout(() => {
                serviceFormRef.current?.setData({
                    name: editedService.nomeServico,
                    price: editedService.valor.toFixed(2),
                    description: editedService.descricaoServico,
                    specialtyId: editedService.especialidade.idEspecialidade.toString()
                });
            }, 100);
        }
    }, [specialties, editedService]);

    const getService = () => {
        let id = Number(routeParams.serviceId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getServiceByIdHttp(id).then(response => {
            setEditedService(response);
            setIsLoading("")
        }).catch(() => {
            setWarning(["danger", "Servi??o n??o encontrado."]);
        });
    }

    const getSpecialties = () => {
        listSpecialtyHttp().then(response => {
            setSpecialties([...response]);
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

    const submitServiceForm: SubmitHandler<ServiceFormData> = async (data, { reset }) => {
        try {
            setIsLoading("service");
            setWarning(["", ""]);
            serviceFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do servi??o."),
                price: Yup.number()
                    .moreThan(0, "Coloque o pre??o do servi??o."),
                description: Yup.string().trim()
                    .required("Coloque a descri????o do servi??o."),
                specialtyId: Yup.string()
                    .required("Selecione a especialidade do servi??o.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let serviceData = {
                nomeServico: data.name,
                valor: data.price,
                descricaoServico: data.description,
                especialidade: {
                    idEspecialidade: Number(data.specialtyId)
                }
            }

            if (!isEdition) {
                await postServiceHttp(serviceData).then(() => {
                    setWarning(["success", "Servi??o cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar o servi??o."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedService !== undefined) {
                await putServiceHttp({
                    ...serviceData,
                    idServico: editedService.idServico
                }).then(() => {
                    setWarning(["success", "Servi??o editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar o servi??o."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                serviceFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do servi??o inv??lidos."]);
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

            let specialtyData = {
                nomeEspecialidade: data.name
            }

            if (!isEdition) {
                postSpecialtyHttp(specialtyData).then(response => {
                    setWarning(["success", "Especialidade cadastrada e selecionada com sucesso."]);
                    setSpecialties([...specialties, response]);
                    toggleModal();
                    reset();

                    setTimeout(() => {
                        serviceFormRef.current?.setFieldValue("specialtyId", response.idEspecialidade.toString());
                    }, 100);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar o servi??o."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                let specialtyId = Number(serviceFormRef.current?.getFieldValue("specialtyId"));

                putSpecialtyHttp({
                    ...specialtyData,
                    idEspecialidade: specialtyId
                }).then(() => {
                    setWarning(["success", "Especialidade editada com sucesso."]);

                    let index = specialties.findIndex(x => x.idEspecialidade === specialtyId);
                    specialties[index].nomeEspecialidade = specialtyData.nomeEspecialidade;
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar a especialidade."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                specialtyFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos da especialidade inv??lidos."]);
            setIsLoading("");
        }
    }

    const onClickOpenSpecialty = () => {
        toggleModal("specialty");

        if (isEdition) {
            let specialtyId = Number(serviceFormRef.current?.getFieldValue("specialtyId"));
            let specialty = specialties.find(x => x.idEspecialidade === specialtyId);

            setTimeout(() => {
                specialtyFormRef.current?.setFieldValue("name", specialty?.nomeEspecialidade);
            }, 100);
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} servi??o | CM`);

    return (
        <>
            <h1>{isEdition ? "Edi????o de servi??o" : "Cadastro de servi??o"}</h1>

            <Form
                ref={serviceFormRef}
                onSubmit={submitServiceForm}
                className="form-data"
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <CurrencyInput
                    name='price'
                    label='Pre??o'
                />

                <FieldInput
                    name='description'
                    label='Descri????o'
                    placeholder='Coloque a descri????o'
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
                    disabled={isEdition}
                />

                {modal === "" && <Warning value={warning} />}

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "service" || isLoading === "get"}
                    type="submit"
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>

            {isEdition
                ? <>
                    <h2>Editar especialidade</h2>
                    <p>Voc?? pode editar os dados da especialidade escolhida.</p>

                    <Button
                        color="warning"
                        onClick={() => onClickOpenSpecialty()}
                        disabled={editedService === undefined}
                    >
                        Editar especialidade
                    </Button>
                </>
                : <>
                    <h2>Adicionar especialidade</h2>
                    <p>Voc?? pode adicionar uma nova especialidade caso n??o tenha encontrado a op????o desejada.</p>

                    <Button
                        color="secondary"
                        onClick={() => onClickOpenSpecialty()}
                    >
                        Adicionar especialidade
                    </Button>
                </>}

            <DataModal
                isOpen={modal === "specialty"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    {isEdition ? "Editar" : "Adicionar"} especialidade
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={specialtyFormRef}
                        onSubmit={submitSpecialtyForm}
                        className="form-modal"
                    >
                        <FieldInput
                            name='name'
                            label='Nome'
                            placeholder='Coloque o nome'
                        />

                        <Warning value={warning} />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text={isEdition ? "Editar" : "Adicionar"}
                        isLoading={isLoading === "specialty"}
                        type='button'
                        color={isEdition ? "warning" : "secondary"}
                        onClick={() => specialtyFormRef.current?.submitForm()}
                    />
                </ModalFooter>
            </DataModal>
        </>
    )
}

export default RegisterService;
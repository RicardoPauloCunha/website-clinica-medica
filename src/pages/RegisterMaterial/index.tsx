import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import CategoriaMaterial from "../../services/entities/categoriaMaterial";
import Fabricante from "../../services/entities/fabricante";
import { listManufacturerHttp, _listManufacturer } from "../../services/http/manufacturer";
import { getMaterialByIdHttp, postMaterialHttp, putMaterialHttp, _listMaterial } from "../../services/http/material";
import { listMaterialCategoryHttp } from "../../services/http/materialCategory";
import { WarningTuple } from "../../util/getHttpErrors";
import * as Yup from 'yup';
import getValidationErrors from "../../util/getValidationErrors";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import { Alert, Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import Warning from "../../components/Warning";
import MaskInput from "../../components/Input/mask";
import { concatenateAddressData, splitAddressData } from "../../util/stringFormat";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import { getEnumMaterialStatus } from "../../services/enums/materialStatus";
import { useParams } from "react-router-dom";
import Material from "../../services/entities/material";

type RegisterFormData = {
    name: string;
    description: string;
    unitMeasurement: string;
    categoryId: number;
    manufacturerCnpj: string;
}

type AddCategoryFormData = {
    categoryName: string;
}

type AddManufacturerFormData = {
    cnpj: string;
    name: string;
    contact: string;
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
}

type ModalString = "add-category" | "add-manufacturer" | "";

const RegisterMaterial = () => {
    const routeParams = useParams();
    const registerFormRef = useRef<FormHandles>(null);
    const addCategoryFormRef = useRef<FormHandles>(null);
    const addManufacturerFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"register" | "get" | "define" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const _itemMaterial = _listMaterial[0];
    const _itemManufacturer = _listManufacturer[0];
    const _itemAddress = splitAddressData(_itemManufacturer.endereco);

    const [categories, setCategories] = useState<CategoriaMaterial[]>([]);
    const [manufacturers, setManufacturers] = useState<Fabricante[]>([]);
    const [manufacturerIndex, setManufacturerIndex] = useState(-1);
    const [editedMaterial, setEditedMaterial] = useState<Material | undefined>(undefined);

    useEffect(() => {
        if (routeParams.materialId !== undefined)
            getMaterial();

        getCategories();
        getManufacturers()
        // eslint-disable-next-line
    }, [routeParams]);

    useEffect(() => {
        if (manufacturers.length > 0 && editedMaterial?.fabricante?.cnpj)
            handlerChangeManufacturer(editedMaterial?.fabricante?.cnpj);
        // eslint-disable-next-line
    }, [manufacturers, editedMaterial]);

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const getCategories = async () => {
        listMaterialCategoryHttp().then(response => {
            setCategories([...response]);
        });
    }

    const getManufacturers = async () => {
        listManufacturerHttp().then(response => {
            setManufacturers([...response]);
        });
    }

    const getMaterial = () => {
        let id = Number(routeParams.materialId);

        if (isNaN(id))
            return;

        setIsLoading("get");
        setTimeout(async () => {
            getMaterialByIdHttp(id).then(response => {
                if (response === undefined)
                    return;

                registerFormRef.current?.setData({
                    name: response.nome,
                    description: response.descricao,
                    unitMeasurement: response.unidadeDeMedida,
                    categoryId: response.categoriaMaterial?.idCategoriaMaterial.toString(),
                    manufacturerCnpj: response.fabricante?.cnpj
                });

                setEditedMaterial(response);
                setIsLoading("");
            });
        }, 1000);
    }

    const submitRegisterForm: SubmitHandler<RegisterFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            registerFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do material."),
                description: Yup.string().trim()
                    .required("Coloque a descrição do material."),
                unitMeasurement: Yup.string().trim()
                    .required("Coloque a unidade de medida do material."),
                categoryId: Yup.string()
                    .required("Selecione a categoria do material."),
                manufacturerCnpj: Yup.string()
                    .required("Selecione o fabricante no material.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.categoryId = Number(data.categoryId);
            let category = categories.find(x => x.idCategoriaMaterial === data.categoryId);
            if (category === undefined) {
                setWarning(["warning", "Categoria não encontrada."]);
                return;
            }

            let manufacturer = manufacturers.find(x => x.cnpj === data.manufacturerCnpj);
            if (manufacturer === undefined) {
                setWarning(["warning", "Fabricante não encontrado."]);
                return;
            }

            category.idCategoriaMaterial = category.idCategoriaMaterial > 0 ? category.idCategoriaMaterial : 0;

            if (editedMaterial === undefined) {
                setTimeout(async () => {
                    postMaterialHttp({
                        idMaterial: 0,
                        nome: data.name,
                        descricao: data.description,
                        unidadeDeMedida: data.unitMeasurement,
                        quantidade: 0,
                        status: getEnumMaterialStatus("enabled"),
                        categoriaMaterial: category,
                        fabricante: manufacturer
                    }).then(() => {
                        setWarning(["success", "Material criado com sucesso."]);
                        reset();

                        if (category?.idCategoriaMaterial === 0) {
                            getCategories().then(() => {
                                data.categoryId = Number(data.categoryId) * -1;
                                registerFormRef.current?.setFieldValue("categoryId", data.categoryId.toString());
                            });
                        }

                        getManufacturers();
                    }).catch(() => {
                        setWarning(["danger", "Não foi possível criar o material."]);
                    }).finally(() => { setIsLoading(""); });
                }, 1000);

                return;
            }

            editedMaterial.nome = data.name;
            editedMaterial.descricao = data.description;
            editedMaterial.unidadeDeMedida = data.unitMeasurement;

            setTimeout(async () => {
                putMaterialHttp(editedMaterial).then(() => {
                    setWarning(["success", "Material editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o material."]);
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

    const submitAddCategoryForm: SubmitHandler<AddCategoryFormData> = async (data, { reset }) => {
        try {
            addCategoryFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                categoryName: Yup.string().trim()
                    .required("Coloque o nome da categoria de material.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let categoryId = (categories.length + 1) * -1;

            setCategories([...categories, {
                idCategoriaMaterial: categoryId,
                nome: data.categoryName
            }]);

            setTimeout(() => {
                registerFormRef.current?.setFieldValue("categoryId", categoryId.toString());
            }, 100);

            reset();
            toggleModal();
            setWarning(["success", "Categoria adicionada e selecionada com sucesso."]);
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                addCategoryFormRef.current?.setErrors(getValidationErrors(err));
        }
    }

    const submitAddManufacturerForm: SubmitHandler<AddManufacturerFormData> = async (data, { reset }) => {
        try {
            addManufacturerFormRef.current?.setErrors({});
            setWarning(["", ""]);

            const shema = Yup.object().shape({
                cnpj: Yup.string().trim()
                    .required("Coloque o CNPJ do fabricante."),
                name: Yup.string().trim()
                    .required("Coloque o nome do fabricante."),
                contact: Yup.string().trim()
                    .required("Coloque o contato (telefone) do fabricante."),
                cep: Yup.string().trim()
                    .required("Coloque o CEP do endereço."),
                street: Yup.string().trim()
                    .required("Coloque a rua do endereço."),
                number: Yup.string().trim()
                    .required("Coloque o número do endereço."),
                district: Yup.string().trim()
                    .required("Coloque o bairro do endereço."),
                city: Yup.string().trim()
                    .required("Coloque a cidade do endereço."),
                state: Yup.string().trim()
                    .required("Coloque o estado (UF) do endereço."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let newIndex = manufacturers.length;

            setManufacturers([...manufacturers, {
                cnpj: data.cnpj,
                nome: data.name,
                endereco: concatenateAddressData({ ...data }),
                contato: data.contact
            }]);

            setTimeout(() => {
                registerFormRef.current?.setFieldValue("manufacturerCnpj", data.cnpj);
            }, 100);

            reset();
            toggleModal();
            setWarning(["success", "Fabricante adicionado e selecionado com sucesso."]);
            setManufacturerIndex(newIndex);
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                addManufacturerFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do fabricante inválidos."]);
        }
    }

    const handlerChangeManufacturer = (optionValue: string) => {
        let index = manufacturers.findIndex(x => x.cnpj === optionValue);
        if (!manufacturers[index])
            return;

        setManufacturerIndex(index);
    }

    return (
        <>
            {routeParams.materialId !== undefined
                ? <h1>
                    Edição de material

                    {isLoading === "get" && <>
                        {' '}
                        <Spinner
                            color="primary"
                            type="grow"
                        />
                    </>}
                </h1>
                : <h1>Cadastro de material</h1>
            }

            <Form
                ref={registerFormRef}
                onSubmit={submitRegisterForm}
                className="form-data"
                initialData={{
                    name: _itemMaterial.nome,
                    description: _itemMaterial.descricao,
                    unitMeasurement: _itemMaterial.unidadeDeMedida
                }}
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome do material'
                />

                <FieldInput
                    name='description'
                    label='Descrição'
                    placeholder='Coloque a descrição do serviço'
                    type="textarea"
                />

                <FieldInput
                    name='unitMeasurement'
                    label='Unidade de medida'
                    placeholder='Coloque a unidade de medida'
                />

                <SelectInput
                    name='categoryId'
                    label='Categoria'
                    placeholder='Selecione a categoria'
                    options={categories.map(x => ({
                        value: x.idCategoriaMaterial.toString(),
                        label: x.nome
                    }))}
                />

                <SelectInput
                    name='manufacturerCnpj'
                    label='Fabricante'
                    placeholder='Selecione o fabricante'
                    options={manufacturers.map(x => ({
                        value: x.cnpj,
                        label: x.nome
                    }))}
                    handlerChange={handlerChangeManufacturer}
                />

                <Button
                    type='submit'
                >
                    {isLoading === "register"
                        ? <Spinner size="sm" />
                        : editedMaterial ? "Editar" : "Cadastrar"
                    }
                </Button>

                {modal === "" && <Warning value={warning} />}
            </Form>

            <h2>Dados do fabricante</h2>

            {manufacturers[manufacturerIndex]
                ? <>
                    <DataCard
                        title={manufacturers[manufacturerIndex].nome}
                        subtitle={manufacturers[manufacturerIndex].cnpj}
                    >
                        <TextGroupGrid>
                            <DataText
                                label="Contato"
                                value={manufacturers[manufacturerIndex].contato}
                            />

                            <DataText
                                label="Endereço"
                                value={manufacturers[manufacturerIndex].endereco}
                            />
                        </TextGroupGrid>
                    </DataCard>
                </>
                : <Alert color="warning">
                    Nenhum fabricante foi selecionado
                </Alert>
            }

            <h2>Adicionar categoria</h2>
            <p>Você pode adicionar uma nova categoria de material caso não tenha encontrado a opção desejada.</p>
            <Button
                onClick={() => toggleModal("add-category")}
                outline
            >
                Adicionar categoria
            </Button>

            <h2>Adicionar fabricante</h2>
            <p>Você pode adicionar uma novo fabricante caso não tenha encontrado a opção desejada.</p>
            <Button
                onClick={() => toggleModal("add-manufacturer")}
                outline
            >
                Adicionar fabricante
            </Button>

            <DataModal
                isOpen={modal === "add-category" || modal === "add-manufacturer"}
                toggle={toggleModal}
                centered
                size={modal === "add-category" ? "" : "lg"}
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    {modal === "add-category" ? "Adicionar categoria" : "Adicionar fabricante"}
                </ModalHeader>

                <ModalBody>
                    {modal === "add-category"
                        ? <Form
                            ref={addCategoryFormRef}
                            onSubmit={submitAddCategoryForm}
                            className="form-modal"
                        >
                            <FieldInput
                                name='categoryName'
                                label='Nome da categoria'
                                placeholder='Coloque o nome da categoria'
                            />
                        </Form>
                        : <Form
                            ref={addManufacturerFormRef}
                            onSubmit={submitAddManufacturerForm}
                            className="form-modal"
                            initialData={{
                                cnpj: _itemManufacturer.cnpj,
                                name: _itemManufacturer.nome,
                                contact: _itemManufacturer.contato,
                                cep: _itemAddress.cep,
                                street: _itemAddress.street,
                                number: _itemAddress.number,
                                district: _itemAddress.district,
                                city: _itemAddress.city,
                                state: _itemAddress.state,
                            }}
                        >
                            <MaskInput
                                name='cnpj'
                                label='CNPJ do fabricante'
                                mask="99.999.999/9999-99"
                                maskChar=""
                                placeholder='00.000.000/0000-00'
                            />

                            <FieldInput
                                name='name'
                                label='Nome do fabricante'
                                placeholder='Coloque o nome do fabricante'
                            />

                            <MaskInput
                                name='contact'
                                label='Contato (telefone)'
                                mask="(99) 9999-9999"
                                placeholder="(00) 0000-0000"
                                maskChar=""
                            />

                            <MaskInput
                                name='cep'
                                label='CEP'
                                mask="99999-999"
                                placeholder="00000-000"
                                maskChar=""
                            />

                            <FieldInput
                                name='street'
                                label='Rua'
                                placeholder='Coloque a rua do endereço'
                            />

                            <FieldInput
                                name='number'
                                label='Número'
                                placeholder='Coloque o número'
                            />

                            <FieldInput
                                name='district'
                                label='Bairro'
                                placeholder='Coloque o bairro'
                            />

                            <FieldInput
                                name='city'
                                label='Cidade'
                                placeholder='Coloque a cidade'
                            />

                            <MaskInput
                                name='state'
                                label='Estado (UF)'
                                mask="aa"
                                maskChar=""
                                placeholder='SP'
                            />

                            {modal === "add-manufacturer" && <Warning value={warning} />}
                        </Form>}
                </ModalBody>

                <ModalFooter>
                    {modal === "add-category"
                        ? <Button
                            type='submit'
                            onClick={() => addCategoryFormRef.current?.submitForm()}
                        >
                            Adicionar categoria
                        </Button>
                        : <Button
                            type='submit'
                            onClick={() => addManufacturerFormRef.current?.submitForm()}
                        >
                            Adicionar fabricante
                        </Button>
                    }

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default RegisterMaterial;
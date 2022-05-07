import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';
import { useParams } from "react-router-dom";

import MaterialStatusEnum from "../../services/enums/materialStatus";
import CategoriaMaterial from "../../services/entities/categoriaMaterial";
import Fabricante from "../../services/entities/fabricante";
import Material from "../../services/entities/material";
import { listManufacturerHttp, postManufacturerHttp, putManufacturerHttp, _listManufacturer } from "../../services/http/manufacturer";
import { getMaterialByIdHttp, postMaterialHttp, putMaterialHttp, _listMaterial } from "../../services/http/material";
import { listCategoryHttp, postCategoryHttp, putCategoryHttp, _listCategory } from "../../services/http/category";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { concatenateAddressData, normalize, splitAddressData } from "../../util/stringFormat";

import { Alert, Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import MaskInput from "../../components/Input/mask";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import LoadingButton from "../../components/LoadingButton";
import ToggleTitle from "../../components/ToggleTitle";

type MaterialFormData = {
    name: string;
    description: string;
    unitMeasurement: string;
    categoryId: number;
    manufacturerCnpj: string;
}

type CategoryFormData = {
    name: string;
}

type ManufacturerFormData = {
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

type ModalString = "category" | "manufacturer" | "";

const RegisterMaterial = () => {
    const routeParams = useParams();
    const materialFormRef = useRef<FormHandles>(null);
    const categoryFormRef = useRef<FormHandles>(null);
    const manufacturerFormRef = useRef<FormHandles>(null);

    const _itemMaterial = _listMaterial[0];
    const _itemCategory = _listCategory[0];
    const _itemManufacturer = _listManufacturer[0];
    const _itemAddress = splitAddressData(_itemManufacturer.enderecoFabricante);

    const [isLoading, setIsLoading] = useState<"material" | "category" | "manufacturer" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [isEdition, setIsEdition] = useState(routeParams.materialId !== undefined);
    const [manufacturerIndex, setManufacturerIndex] = useState(-1);

    const [categories, setCategories] = useState<CategoriaMaterial[]>([]);
    const [manufacturers, setManufacturers] = useState<Fabricante[]>([]);
    const [editedMaterial, setEditedMaterial] = useState<Material | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);

        if (routeParams.materialId !== undefined) {
            setIsEdition(true);
            getMaterial();
        }
        else {
            setIsEdition(false);
            // materialFormRef.current?.reset();
            // categoryFormRef.current?.reset();
            // manufacturerFormRef.current?.reset();
            // TODO: Descomentar
        }

        getCategories();
        getManufacturers()
        // eslint-disable-next-line
    }, [routeParams]);

    useEffect(() => {
        if (categories.length !== 0 && manufacturers.length !== 0 && editedMaterial !== undefined) {
            setTimeout(() => {
                materialFormRef.current?.setData({
                    name: editedMaterial.nomeMaterial,
                    description: editedMaterial.descricao,
                    unitMeasurement: editedMaterial.unidadeDeMedida,
                    categoryId: editedMaterial.categoriaMaterial?.idCategoria.toString(),
                    manufacturerCnpj: editedMaterial.fabricante?.cnpj
                });

                handlerChangeManufacturer(editedMaterial?.fabricante?.cnpj as string);
            }, 100);
        }
        // eslint-disable-next-line
    }, [categories, manufacturers, editedMaterial]);

    const getMaterial = () => {
        let id = Number(routeParams.materialId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getMaterialByIdHttp(id).then(response => {
            setEditedMaterial(response);
            setIsLoading("");
        });
    }

    const getCategories = async () => {
        listCategoryHttp().then(response => {
            setCategories([...response]);
        });
    }

    const getManufacturers = async () => {
        listManufacturerHttp().then(response => {
            setManufacturers([...response]);
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const submitMaterialForm: SubmitHandler<MaterialFormData> = async (data, { reset }) => {
        try {
            setIsLoading("material");
            setWarning(["", ""]);
            materialFormRef.current?.setErrors({});

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

            let materialData = {
                nomeMaterial: data.name,
                unidadeDeMedida: data.unitMeasurement,
                quantidade: 0,
                descricao: data.description,
                categoriaMaterial: {
                    idCategoria: Number(data.categoryId)
                },
                fabricante: {
                    cnpj: normalize(data.manufacturerCnpj)
                },
                statusMaterial: MaterialStatusEnum.Enabled,
            }

            if (!isEdition) {
                postMaterialHttp(materialData).then(() => {
                    setWarning(["success", "Material cadastrado com sucesso."]);
                    reset();
                    setManufacturerIndex(-1);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o material."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedMaterial !== undefined) {
                putMaterialHttp({
                    ...materialData,
                    statusMaterial: editedMaterial.statusMaterial,
                    idMaterial: editedMaterial.idMaterial,
                }).then(() => {
                    setWarning(["success", "Material editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o material."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                materialFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do material inválidos."]);
            setIsLoading("");
        }
    }

    const submitCategoryForm: SubmitHandler<CategoryFormData> = async (data, { reset }) => {
        try {
            setIsLoading("category");
            setWarning(["", ""]);
            categoryFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome da categoria.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let categoryData = {
                nomeCategoria: data.name
            }

            if (!editedMaterial) {
                postCategoryHttp(categoryData).then(response => {
                    toggleModal();
                    setWarning(["success", "Categoria cadastrada e selecionada com sucesso."]);
                    setCategories([...categories, response]);
                    reset();

                    setTimeout(() => {
                        materialFormRef.current?.setFieldValue("categoryId", response.idCategoria.toString());
                    }, 100);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar a categoria."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                let categoryId = Number(materialFormRef.current?.getFieldValue("categoryId"));

                putCategoryHttp({
                    ...categoryData,
                    idCategoria: categoryId
                }).then(() => {
                    setWarning(["success", "Categoria editada com sucesso."]);

                    let index = categories.findIndex(x => x.idCategoria === categoryId);
                    categories[index].nomeCategoria = categoryData.nomeCategoria;
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar a categoria."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                categoryFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos da categoria inválidos."]);
            setIsLoading("");
        }
    }

    const submitManufacturerForm: SubmitHandler<ManufacturerFormData> = async (data, { reset }) => {
        try {
            setIsLoading("manufacturer");
            setWarning(["", ""]);
            manufacturerFormRef.current?.setErrors({});

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

            let manufacturerData = {
                cnpj: normalize(data.cnpj),
                nomeFabricante: data.name,
                enderecoFabricante: concatenateAddressData({ ...data }),
                contatoFabricante: data.contact
            }

            if (!editedMaterial) {
                postManufacturerHttp(manufacturerData).then(response => {
                    toggleModal();
                    setWarning(["success", "Fabricante cadastrado e selecionado com sucesso."]);
                    setManufacturerIndex(manufacturers.length);
                    setManufacturers([...manufacturers, response]);
                    reset();
    
                    setTimeout(() => {
                        materialFormRef.current?.setFieldValue("manufacturerCnpj", response.cnpj);
                    }, 100);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o fabricante."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                putManufacturerHttp(manufacturerData).then(() => {
                    setWarning(["success", "Fabricante editado com sucesso."]);

                    let index = manufacturers.findIndex(x => x.cnpj === manufacturerData.cnpj);
                    manufacturers[index] = {...manufacturerData};
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o fabricante."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                manufacturerFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do fabricante inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeManufacturer = (optionValue: string) => {
        optionValue = normalize(optionValue);
        let index = manufacturers.findIndex(x => x.cnpj === optionValue);
        setManufacturerIndex(index);
    }

    const onClickOpenCategory = () => {
        toggleModal("category");

        if (isEdition) {
            let categoryId = Number(materialFormRef.current?.getFieldValue("categoryId"));
            let category = categories.find(x => x.idCategoria === categoryId);

            setTimeout(() => {
                categoryFormRef.current?.setFieldValue("name", category?.nomeCategoria);
            }, 100);
        }
    }

    const onClickOpenManufacturer = () => {
        toggleModal("manufacturer");

        if (isEdition) {
            let manufacturerCnpj = normalize(materialFormRef.current?.getFieldValue("manufacturerCnpj"));
            let manufacturer = manufacturers.find(x => x.cnpj === manufacturerCnpj);

            if (manufacturer === undefined)
                return;

            let address = splitAddressData(manufacturer.enderecoFabricante);

            setTimeout(() => {
                manufacturerFormRef.current?.setData({
                    cnpj: manufacturer?.cnpj,
                    name: manufacturer?.nomeFabricante,
                    contact: manufacturer?.contatoFabricante,
                    ...address
                });
            }, 100);
        }
    }

    return (
        <>
            <ToggleTitle
                toggle={isEdition}
                isLoading={isLoading === "get"}
                title="Cadastro de material"
                alternateTitle="Edição de material"
            />

            <Form
                ref={materialFormRef}
                onSubmit={submitMaterialForm}
                className="form-data"
                initialData={{
                    name: _itemMaterial.nomeMaterial,
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
                    rows="4"
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
                        value: x.idCategoria?.toString() as string,
                        label: x.nomeCategoria
                    }))}
                />

                <SelectInput
                    name='manufacturerCnpj'
                    label='Fabricante'
                    placeholder='Selecione o fabricante'
                    options={manufacturers.map(x => ({
                        value: x.cnpj,
                        label: x.nomeFabricante
                    }))}
                    handlerChange={handlerChangeManufacturer}
                />

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "material"}
                    type="submit"
                />

                {modal === "" && <Warning value={warning} />}
            </Form>

            <h2>Dados do fabricante</h2>

            {manufacturers[manufacturerIndex]
                ? <DataCard
                    title={manufacturers[manufacturerIndex].nomeFabricante}
                    subtitle={manufacturers[manufacturerIndex].cnpj}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Contato"
                            value={manufacturers[manufacturerIndex].contatoFabricante}
                        />

                        <DataText
                            label="Endereço"
                            value={manufacturers[manufacturerIndex].enderecoFabricante}
                        />
                    </TextGroupGrid>

                    {isEdition && <ButtonGroupRow>
                        <Button
                            color="warning"
                            outline
                            onClick={() => onClickOpenManufacturer()}
                        >
                            Editar
                        </Button>
                    </ButtonGroupRow>}
                </DataCard>
                : <Alert color="warning">
                    Nenhum fabricante foi selecionado.
                </Alert>
            }

            {isEdition
                ? <>
                    <h2>Editar categoria</h2>
                    <p>Você pode editar os dados da categoria escolhida.</p>

                    <Button
                        onClick={() => onClickOpenCategory()}
                        outline
                        color="warning"
                    >
                        Editar categoria
                    </Button>
                </>
                : <>
                    <h2>Adicionar categoria</h2>
                    <p>Você pode adicionar uma nova categoria de material caso não tenha encontrado a opção desejada.</p>

                    <Button
                        onClick={() => onClickOpenCategory()}
                        outline
                    >
                        Adicionar categoria
                    </Button>
                </>
            }

            <DataModal
                isOpen={modal === "category"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Adicionar categoria
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={categoryFormRef}
                        onSubmit={submitCategoryForm}
                        className="form-modal"
                        initialData={{
                            name: _itemCategory.nomeCategoria
                        }}
                    >
                        <FieldInput
                            name='name'
                            label='Nome da categoria'
                            placeholder='Coloque o nome da categoria'
                        />
                    </Form>

                    {modal === "category" && <Warning value={warning} />}
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text={isEdition ? "Editar" : "Adicionar"}
                        isLoading={isLoading === "category"}
                        type='button'
                        onClick={() => categoryFormRef.current?.submitForm()}
                    />

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </DataModal>

            {!isEdition && <>
                <h2>Adicionar fabricante</h2>
                <p>Você pode adicionar uma novo fabricante caso não tenha encontrado a opção desejada.</p>

                <Button
                    onClick={() => toggleModal("manufacturer")}
                    outline
                >
                    Adicionar fabricante
                </Button>
            </>}

            <DataModal
                isOpen={modal === "manufacturer"}
                toggle={toggleModal}
                centered
                size="lg"
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    {isEdition ? "Editar" : "Adicionar"} fabricante
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={manufacturerFormRef}
                        onSubmit={submitManufacturerForm}
                        className="form-modal"
                        initialData={{
                            cnpj: _itemManufacturer.cnpj,
                            name: _itemManufacturer.nomeFabricante,
                            contact: _itemManufacturer.contatoFabricante,
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
                            disabled={isEdition}
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

                        {modal === "manufacturer" && <Warning value={warning} />}
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text={isEdition ? "Editar" : "Adicionar"}
                        isLoading={isLoading === "manufacturer"}
                        type='button'
                        onClick={() => manufacturerFormRef.current?.submitForm()}
                    />

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
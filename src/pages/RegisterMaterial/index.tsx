import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';
import { useParams } from "react-router-dom";

import CategoriaMaterial from "../../services/entities/categoriaMaterial";
import Fabricante from "../../services/entities/fabricante";
import Material from "../../services/entities/material";
import MaterialStatusEnum from "../../services/enums/materialStatus";
import { listManufacturerHttp, postManufacturerHttp, putManufacturerHttp } from "../../services/http/manufacturer";
import { getMaterialByIdHttp, postMaterialHttp, putMaterialHttp } from "../../services/http/material";
import { listCategoryHttp, postCategoryHttp, putCategoryHttp } from "../../services/http/category";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { normalize } from "../../util/formatString";
import { concatenateAddress, splitAddress } from "../../util/formatAddress";
import DocumentTitle from "../../util/documentTitle";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DataModal, Form } from "../../styles/components";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import MaskInput from "../../components/Input/mask";
import Warning from "../../components/Warning";
import LoadingButton from "../../components/LoadingButton";
import ManufacturerCollapseCard from "../../components/CollapseCard/manufacturer";

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

    const [isLoading, setIsLoading] = useState<"material" | "category" | "manufacturer" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [isEdition, setIsEdition] = useState(routeParams.materialId !== undefined);
    const [manufacturerIndex, setManufacturerIndex] = useState(-1);

    const [categories, setCategories] = useState<CategoriaMaterial[]>([]);
    const [manufacturers, setManufacturers] = useState<Fabricante[]>([]);
    const [editedMaterial, setEditedMaterial] = useState<Material | undefined>(undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);
        setModal("");
        setManufacturerIndex(-1);
        setEditedMaterial(undefined);

        if (routeParams.materialId !== undefined) {
            setIsEdition(true);
            getMaterial();
        }
        else {
            setIsEdition(false);
            materialFormRef.current?.reset();
            categoryFormRef.current?.reset();
            manufacturerFormRef.current?.reset();
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
                    categoryId: editedMaterial.categoriaMaterial.idCategoria.toString(),
                    manufacturerCnpj: editedMaterial.fabricante.cnpj
                });

                handlerChangeManufacturer(editedMaterial.fabricante.cnpj);
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
        }).catch(() => {
            setWarning(["danger", "Material n??o encontrado."]);
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
        if (typeof (modalName) === "string") {
            setModal(modalName);
            setWarning(["", ""]);
        }
        else {
            setModal("");
        }
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
                    .required("Coloque a descri????o do material."),
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
                    setWarning(["danger", "N??o foi poss??vel cadastrar o material."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedMaterial !== undefined) {
                putMaterialHttp({
                    ...materialData,
                    quantidade: editedMaterial.quantidade,
                    statusMaterial: editedMaterial.statusMaterial,
                    idMaterial: editedMaterial.idMaterial,
                }).then(() => {
                    setWarning(["success", "Material editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar o material."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                materialFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do material inv??lidos."]);
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
                    setWarning(["success", "Categoria cadastrada e selecionada com sucesso."]);
                    setCategories([...categories, response]);
                    toggleModal();
                    reset();

                    setTimeout(() => {
                        materialFormRef.current?.setFieldValue("categoryId", response.idCategoria.toString());
                    }, 100);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar a categoria."]);
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
                    setWarning(["danger", "N??o foi poss??vel editar a categoria."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                categoryFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos da categoria inv??lidos."]);
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
                    .required("Coloque o CEP do endere??o."),
                street: Yup.string().trim()
                    .required("Coloque a rua do endere??o."),
                number: Yup.string().trim()
                    .required("Coloque o n??mero do endere??o."),
                district: Yup.string().trim()
                    .required("Coloque o bairro do endere??o."),
                city: Yup.string().trim()
                    .required("Coloque a cidade do endere??o."),
                state: Yup.string().trim()
                    .required("Coloque o estado (UF) do endere??o.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let manufacturerData = {
                cnpj: normalize(data.cnpj),
                nomeFabricante: data.name,
                enderecoFabricante: concatenateAddress({ ...data }),
                contatoFabricante: normalize(data.contact)
            }

            if (!editedMaterial) {
                postManufacturerHttp(manufacturerData).then(response => {
                    setWarning(["success", "Fabricante cadastrado e selecionado com sucesso."]);
                    setManufacturerIndex(manufacturers.length);
                    setManufacturers([...manufacturers, response]);
                    toggleModal();
                    reset();

                    setTimeout(() => {
                        materialFormRef.current?.setFieldValue("manufacturerCnpj", response.cnpj);
                    }, 100);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar o fabricante."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                putManufacturerHttp(manufacturerData).then(() => {
                    setWarning(["success", "Fabricante editado com sucesso."]);

                    let index = manufacturers.findIndex(x => x.cnpj === manufacturerData.cnpj);
                    manufacturers[index] = { ...manufacturerData };
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar o fabricante."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                manufacturerFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do fabricante inv??lidos."]);
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

            let address = splitAddress(manufacturer.enderecoFabricante);

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

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} material | CM`);

    return (
        <>
            <h1>{isEdition ? "Edi????o de material" : "Cadastro de material"}</h1>

            <Form
                ref={materialFormRef}
                onSubmit={submitMaterialForm}
                className="form-data"
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <FieldInput
                    name='description'
                    label='Descri????o'
                    placeholder='Coloque a descri????o'
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
                        value: x.idCategoria.toString(),
                        label: x.nomeCategoria
                    }))}
                    disabled={isEdition}
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
                    disabled={isEdition}
                />

                {manufacturers[manufacturerIndex] && <ManufacturerCollapseCard
                    cnpj={manufacturers[manufacturerIndex].cnpj}
                    name={manufacturers[manufacturerIndex].nomeFabricante}
                    contact={manufacturers[manufacturerIndex].contatoFabricante}
                    address={manufacturers[manufacturerIndex].enderecoFabricante}
                />}

                {modal === "" && <Warning value={warning} />}

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "material" || isLoading === "get"}
                    type="submit"
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>

            {isEdition
                ? <>{editedMaterial && <>
                    <h2>Editar categoria</h2>
                    <p>Voc?? pode editar os dados da categoria selecionada.</p>

                    <Button
                        color="warning"
                        onClick={() => onClickOpenCategory()}
                    >
                        Editar categoria
                    </Button>
                </>}</>
                : <>
                    <h2>Adicionar categoria</h2>
                    <p>Voc?? pode adicionar uma nova categoria de material caso n??o tenha encontrado a op????o desejada.</p>

                    <Button
                        color="secondary"
                        onClick={() => onClickOpenCategory()}
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
                        isLoading={isLoading === "category"}
                        type='button'
                        color={isEdition ? "warning" : "secondary"}
                        onClick={() => categoryFormRef.current?.submitForm()}
                    />
                </ModalFooter>
            </DataModal>

            {isEdition
                ? <>{editedMaterial && <>
                    <h2>Editar fabricante</h2>
                    <p>Voc?? pode editar os dados do fabricante selecionado.</p>

                    <Button
                        color="warning"
                        onClick={() => onClickOpenManufacturer()}
                    >
                        Editar fabricante
                    </Button>
                </>}</>
                : <>
                    <h2>Adicionar fabricante</h2>
                    <p>Voc?? pode adicionar uma novo fabricante caso n??o tenha encontrado a op????o desejada.</p>

                    <Button
                        color="secondary"
                        onClick={() => onClickOpenManufacturer()}
                    >
                        Adicionar fabricante
                    </Button>
                </>
            }

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
                    >
                        <MaskInput
                            name='cnpj'
                            label='CNPJ'
                            mask="99.999.999/9999-99"
                            maskChar=""
                            placeholder='00.000.000/0000-00'
                            disabled={isEdition}
                        />

                        <FieldInput
                            name='name'
                            label='Nome'
                            placeholder='Coloque o nome'
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
                            placeholder='Coloque a rua'
                        />

                        <FieldInput
                            name='number'
                            label='N??mero'
                            placeholder='Coloque o n??mero'
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

                        <Warning value={warning} />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text={isEdition ? "Editar" : "Adicionar"}
                        isLoading={isLoading === "manufacturer"}
                        type='button'
                        color={isEdition ? "warning" : "secondary"}
                        onClick={() => manufacturerFormRef.current?.submitForm()}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default RegisterMaterial;
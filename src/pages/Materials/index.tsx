import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import { useAuth } from "../../contexts/auth";
import Material from "../../services/entities/material";
import CategoriaMaterial from "../../services/entities/categoriaMaterial";
import RecordTypeEnum, { listRecordType } from "../../services/enums/recordType";
import { listMaterialByParamsHttp, putMaterialHttp } from "../../services/http/material";
import { listCategoryHttp } from "../../services/http/category";
import { postRecordHttp } from "../../services/http/record";
import getValidationErrors from "../../util/getValidationErrors";
import { WarningTuple } from "../../util/getHttpErrors";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DataModal, Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";
import MaterialCard from "../../components/DataCard/material";

type RecordFormData = {
    recordType: number;
    quantity: number;
    description: string;
}

type ModalString = "record" | "";

const Materials = () => {
    const navigate = useNavigate();
    const recordFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _recordTypes = listRecordType();

    const [isLoading, setIsLoading] = useState<"get" | "record" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const [categories, setCategories] = useState<CategoriaMaterial[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [materialIndex, setMaterialIndex] = useState(-1);

    useEffect(() => {
        getCategories();
        getMaterials(null);
        // eslint-disable-next-line
    }, []);

    const getCategories = async () => {
        listCategoryHttp().then(response => {
            setCategories([...response]);
        });
    }

    const getMaterials = (categoryId: number | null) => {
        setIsLoading("get");
        setWarning(["", ""]);

        listMaterialByParamsHttp({
            idCategoria: categoryId
        }).then(response => {
            setMaterials([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum material foi encontrado."]);

            setIsLoading("");
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

    const submitRecordForm: SubmitHandler<RecordFormData> = async (data, { reset }) => {
        try {
            if (loggedUser === undefined)
                return;

            setIsLoading("record");
            setWarning(["", ""]);
            recordFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                recordType: Yup.string()
                    .required("Coloque o tipo de registro."),
                quantity: Yup.string()
                    .required("Coloque a quantidade do material."),
                description: Yup.string().trim()
                    .required("Coloque a descrição do material.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.recordType = Number(data.recordType);
            data.quantity = Number(data.quantity);

            if (data.recordType === RecordTypeEnum.Input)
                materials[materialIndex].quantidade += data.quantity;
            else
                materials[materialIndex].quantidade -= data.quantity;

            await postRecordHttp({
                quantidade: data.quantity,
                descricao: data.description,
                material: {
                    idMaterial: materials[materialIndex].idMaterial
                },
                funcionario: {
                    idFuncionario: loggedUser.employeeId
                },
                tipoEntradaSaida: data.recordType
            }).then(() => {
                setWarning(["success", "Registro de material cadastrado com sucesso."]);
                reset();

                sendChangeQuantity();
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o registro de material."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                recordFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do registro inválidos."]);
            setIsLoading("");
        }
    }

    const sendChangeQuantity = () => {
        putMaterialHttp({
            idMaterial: materials[materialIndex].idMaterial,
            nomeMaterial: materials[materialIndex].nomeMaterial,
            unidadeDeMedida: materials[materialIndex].unidadeDeMedida,
            quantidade: materials[materialIndex].quantidade,
            descricao: materials[materialIndex].descricao,
            categoriaMaterial: {
                idCategoria: materials[materialIndex].categoriaMaterial.idCategoria,
            },
            fabricante: {
                cnpj: materials[materialIndex].fabricante.cnpj,
            },
            statusMaterial: materials[materialIndex].statusMaterial
        });
    }

    const handlerChangeCategoryId = (optionValue: string) => {
        let categoryId = Number(optionValue);
        getMaterials(categoryId);
    }

    const onClickAddRecord = (materialId: number) => {
        let index = materials.findIndex(x => x.idMaterial === materialId);
        setMaterialIndex(index);
        toggleModal("record");
    }

    const onClickViewRecords = () => {
        navigate("/materiais/" + materials[materialIndex].idMaterial + "/registros");
    }

    return (
        <>
            <h1>Lista de materiais</h1>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='categoryId'
                    label='Categoria'
                    placeholder='Filtrar pela categoria do material'
                    options={categories.map(x => ({
                        value: x.idCategoria.toString(),
                        label: x.nomeCategoria
                    }))}
                    handlerChange={handlerChangeCategoryId}
                />

                {modal === "" && <Warning value={warning} />}
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {materials.map(x => (
                <MaterialCard
                    key={x.idMaterial}
                    id={x.idMaterial}
                    name={x.nomeMaterial}
                    description={x.descricao}
                    unitMeasurement={x.unidadeDeMedida}
                    quantity={x.quantidade}
                    categoryName={x.categoriaMaterial.nomeCategoria}
                    manufacturerName={x.fabricante.nomeFabricante}
                    onClickAddRecord={onClickAddRecord}
                />
            ))}

            <DataModal
                isOpen={modal === "record"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Registrar entrada/saída
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={recordFormRef}
                        onSubmit={submitRecordForm}
                        className="form-modal"
                    >
                        <SelectInput
                            name='recordType'
                            label='Tipo de registro'
                            placeholder='Selecione o tipo de registro'
                            options={_recordTypes.map((x, index) => ({
                                value: `${index + 1}`,
                                label: x
                            }))}
                        />

                        <FieldInput
                            name='quantity'
                            label='Quantidade'
                            placeholder='Coloque a quantidade do produto'
                            type="number"
                        />

                        <FieldInput
                            name='description'
                            label='Descrição'
                            placeholder='Coloque a descrição do registro'
                            type="textarea"
                            rows="4"
                        />

                        <Warning value={warning} />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text="Registrar"
                        isLoading={isLoading === "record"}
                        type="button"
                        color="secondary"
                        onClick={() => recordFormRef.current?.submitForm()}
                    />

                    <Button
                        color="info"
                        outline
                        onClick={() => onClickViewRecords()}
                    >
                        Registros
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Materials;
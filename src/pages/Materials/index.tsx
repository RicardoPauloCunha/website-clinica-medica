import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import { useAuth } from "../../contexts/auth";
import RecordTypeEnum, { listRecordType } from "../../services/enums/recordType";
import Material from "../../services/entities/material";
import CategoriaMaterial from "../../services/entities/categoriaMaterial";
import { listMaterialByCategoryHttp, putMaterialHttp } from "../../services/http/material";
import { listCategoryHttp } from "../../services/http/category";
import { postRecordHttp } from "../../services/http/record";
import getValidationErrors from "../../util/getValidationErrors";
import { WarningTuple } from "../../util/getHttpErrors";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";

type RecordFormData = {
    recordTypeIndex: number;
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

        listMaterialByCategoryHttp({
            idCategoria: categoryId
        }).then(response => {
            setMaterials([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum material foi encontrado."]);

            setIsLoading("");
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const submitRecordForm: SubmitHandler<RecordFormData> = async (data, { reset }) => {
        try {
            setIsLoading("record");
            setWarning(["", ""]);
            recordFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                recordTypeIndex: Yup.string()
                    .required("Coloque o tipo do registro."),
                quantity: Yup.string()
                    .required("Coloque a quantidade do material."),
                description: Yup.string().trim()
                    .required("Coloque a descrição do material.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.recordTypeIndex = Number(data.recordTypeIndex);
            data.quantity = Number(data.quantity);

            if (data.recordTypeIndex === RecordTypeEnum.Input)
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
                    idFuncionario: loggedUser?.employeeId as number
                },
                tipoEntradaSaida: data.recordTypeIndex
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
                idCategoria: materials[materialIndex].categoriaMaterial?.idCategoria as number,
            },
            fabricante: {
                cnpj: materials[materialIndex].fabricante?.cnpj as string,
            },
            statusMaterial: materials[materialIndex].statusMaterial
        });
    }

    const handlerChangeCategoryId = (optionValue: string) => {
        let categoryId = Number(optionValue);
        getMaterials(categoryId);
    }

    const onClickEditData = (index: number) => {
        navigate("/materiais/" + materials[index].idMaterial + "/editar");
    }

    const onClickViewRecords = (index: number) => {
        navigate("/materiais/" + materials[index].idMaterial + "/registros");
    }

    const onClickAddRecord = (index: number) => {
        setMaterialIndex(index);
        toggleModal("record");
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
                    label='Categoria do material'
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

            {materials.map((x, index) => (
                <DataCard
                    key={x.idMaterial}
                    title={x.nomeMaterial}
                    subtitle={x.descricao}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Unidade de medida"
                            value={x.unidadeDeMedida}
                        />

                        <DataText
                            label="Quantidade"
                            value={x.quantidade.toString()}
                        />

                        <DataText
                            label="Categoria"
                            value={x.categoriaMaterial?.nomeCategoria as string}
                        />

                        <DataText
                            label="Fabricante"
                            value={x.fabricante?.nomeFabricante as string}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        <Button
                            color="warning"
                            outline
                            onClick={() => onClickEditData(index)}
                        >
                            Editar
                        </Button>

                        <Button
                            color="primary"
                            outline
                            onClick={() => onClickViewRecords(index)}
                        >
                            Registros
                        </Button>

                        <Button
                            color="success"
                            onClick={() => onClickAddRecord(index)}
                        >
                            Entrada/Saída
                        </Button>
                    </ButtonGroupRow>
                </DataCard>
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
                        initialData={{
                            quantity: 100,
                            description: "Teste do teste"
                        }}
                    >
                        <SelectInput
                            name='recordTypeIndex'
                            label='Tipo do registro'
                            placeholder='Selecione o tipo do registro'
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
                        onClick={() => recordFormRef.current?.submitForm()}
                    />

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Materials;
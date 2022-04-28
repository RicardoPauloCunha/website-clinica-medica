import { useEffect, useRef, useState } from "react";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import { WarningTuple } from "../../util/getHttpErrors";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Material from "../../services/entities/material";
import { listMaterialByCategoryHttp, putMaterialHttp } from "../../services/http/material";
import CategoriaMaterial from "../../services/entities/categoriaMaterial";
import { listMaterialCategoryHttp } from "../../services/http/materialCategory";
import { FormHandles, SubmitHandler } from "@unform/core";
import { getValueMaterialInputOutputType, listMaterialInputOutputType } from "../../services/enums/materialInputOutputType";
import FieldInput from "../../components/Input";
import * as Yup from 'yup';
import { postMaterialInputOutputHttp } from "../../services/http/materialInputOutput";
import getValidationErrors from "../../util/getValidationErrors";

type RecordFormData = {
    materialInputOutputTypeIndex: number;
    quantity: number;
    description: string;
}

type ModalString = "record" | "";

const Materials = () => {
    const navigate = useNavigate();
    const recordFormRef = useRef<FormHandles>(null);

    const _typesMaterialInputOutput = listMaterialInputOutputType();

    const INPUT_TYPE = getValueMaterialInputOutputType("input");

    const [isLoading, setIsLoading] = useState<"get" | "record" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const [categories, setCategories] = useState<CategoriaMaterial[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [materialIndex, setMaterialIndex] = useState(-1);

    useEffect(() => {
        getCategories();
        getMaterials(0);
    }, []);

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const getCategories = async () => {
        listMaterialCategoryHttp().then(response => {
            setCategories([...response]);
        });
    }

    const getMaterials = (categoryId: number) => {
        setIsLoading("get");
        setWarning(["", ""]);

        setTimeout(() => {
            listMaterialByCategoryHttp(categoryId).then(response => {
                setMaterials([...response]);

                if (response.length === 0)
                    setWarning(["warning", "Nenhum material foi encontrado."]);

                setIsLoading("");
            });
        }, 1000);
    }

    const submitRecordForm: SubmitHandler<RecordFormData> = async (data, { reset }) => {
        try {
            setIsLoading("record");
            setWarning(["", ""]);
            recordFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                materialInputOutputTypeIndex: Yup.string()
                    .required("Coloque o tipo do registro."),
                quantity: Yup.string()
                    .required("Coloque a quantidade do material."),
                description: Yup.string().trim()
                    .required("Coloque a descrição do material.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.materialInputOutputTypeIndex = Number(data.materialInputOutputTypeIndex);
            data.quantity = Number(data.quantity);

            setTimeout(async () => {
                await postMaterialInputOutputHttp({
                    idEntradaSaidaMateria: 0,
                    data: new Date().toLocaleString() + '',
                    quantidade: data.quantity,
                    descricao: data.description,
                    tipoEntradaSaida: data.materialInputOutputTypeIndex,
                    material: materials[materialIndex]
                }).then(() => {
                    setWarning(["success", "Registro criado com sucesso."]);
                    reset();

                    if (_typesMaterialInputOutput[data.materialInputOutputTypeIndex] === INPUT_TYPE)
                        materials[materialIndex].quantidade += data.quantity;
                    else
                        materials[materialIndex].quantidade -= data.quantity;

                    putMaterialHttp(materials[materialIndex]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível criar o registro."]);
                }).finally(() => { setIsLoading(""); });
            }, 1000);
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                recordFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do registro inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeCategoryId = (optionValue: string) => {
        let categoryId = Number(optionValue) + 1;
        getMaterials(categoryId);
    }

    const onClickEditData = (index: number) => {
        if (index === -1)
            return;

        navigate("/material/" + materials[index].idMaterial + "/editar");
    }

    const onClickViewRecords = (index: number) => {
        if (index === -1)
            return;

        navigate("/material/" + materials[index].idMaterial + "/registros");
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
                        value: x.idCategoriaMaterial.toString(),
                        label: x.nome
                    }))}
                    handlerChange={handlerChangeCategoryId}
                />

                {modal === "" && <Warning value={warning} />}
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {materials.map((x, index) => (
                <DataCard
                    key={x.idMaterial}
                    title={x.nome}
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
                            value={x.categoriaMaterial?.nome as string}
                        />

                        <DataText
                            label="Fabricante"
                            value={x.fabricante?.nome as string}
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
                    >
                        <SelectInput
                            name='materialInputOutputTypeIndex'
                            label='Tipo do registro'
                            placeholder='Selecione o tipo do registro'
                            options={_typesMaterialInputOutput.map((x, index) => ({
                                value: index.toString(),
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
                        />

                        <Warning value={warning} />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <Button
                        color="success"
                        onClick={() => recordFormRef.current?.submitForm()}
                    >
                        {isLoading === "record"
                            ? <Spinner size="sm" />
                            : "Registrar"
                        }
                    </Button>

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
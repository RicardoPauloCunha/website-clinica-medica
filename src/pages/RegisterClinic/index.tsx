import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Clinica from "../../services/entities/clinicaa";
import { getCurrentClinicHttp, postClinicHttp, putClinicHttp } from "../../services/http/clinic";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { concatenateAddress, splitAddress } from "../../util/formatAddress";
import { normalize } from "../../util/formatString";
import DocumentTitle from "../../util/documentTitle";

import { Form } from "../../styles/components";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";
import MaskInput from "../../components/Input/mask";
import LoadingButton from "../../components/LoadingButton";

interface ClinicFormData {
    cnpj: string;
    name: string;
    municipalInscription: string;
    business: string;
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
}

const RegisterClinic = () => {
    const clinicFormRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"register" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isEdition, setIsEdition] = useState(false);

    const [editedClinic, setEditedClinic] = useState<Clinica | undefined>(undefined);

    useEffect(() => {
        setWarning(["", ""]);

        getClinic();
        // eslint-disable-next-line
    }, []);

    const getClinic = () => {
        getCurrentClinicHttp().then(response => {
            setEditedClinic(response);
            setIsEdition(true);

            let address = splitAddress(response.endereco);

            setTimeout(() => {
                clinicFormRef.current?.setData({
                    cnpj: response.cnpj,
                    name: response.nome,
                    municipalInscription: response.inscricaoMunicipal,
                    business: response.atividade,
                    ...address
                });
            }, 100);
        }).catch(() => {
            setIsEdition(false);
        });
    }

    const submitClinicForm: SubmitHandler<ClinicFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            clinicFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                cnpj: Yup.string().trim()
                    .required("Coloque o CNPJ da clínica."),
                name: Yup.string().trim()
                    .required("Coloque o nome da clínica."),
                municipalInscription: Yup.string().trim()
                    .required("Coloque a inscrição estadual da clínica."),
                business: Yup.string().trim()
                    .required("Coloque a atividade da clínica."),
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
                    .required("Coloque o estado (UF) do endereço.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let clinicData = {
                nome: data.name,
                cnpj: normalize(data.cnpj),
                endereco: concatenateAddress({ ...data }),
                inscricaoMunicipal: data.municipalInscription,
                atividade: data.business
            };

            if (!isEdition) {
                await postClinicHttp(clinicData).then(() => {
                    setWarning(["success", "Clínica médica cadastrada com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar a clínica médica."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedClinic !== undefined) {
                await putClinicHttp({
                    ...clinicData,
                    idClinica: editedClinic.idClinica
                }).then(() => {
                    setWarning(["success", "Clínica médica editada com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar a Clínica médica."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                clinicFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos da Clínica médica inválidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} clínica | CM`);

    return (
        <>
            <h1>Dados da Clínica Médica</h1>

            <Form
                ref={clinicFormRef}
                onSubmit={submitClinicForm}
                className="form-data"
            >
                <MaskInput
                    name='cnpj'
                    label='CNPJ'
                    mask="99.999.999/9999-99"
                    maskChar=""
                    placeholder='00.000.000/0000-00'
                />

                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <FieldInput
                    name='municipalInscription'
                    label='Inscrição estadual'
                    placeholder='Coloque a inscrição estadual'
                />

                <FieldInput
                    name='business'
                    label='Atividade'
                    placeholder='Coloque a atividade'
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

                <Warning value={warning} />

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "register" || isLoading === "get"}
                    type='submit'
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>
        </>
    );
}

export default RegisterClinic;
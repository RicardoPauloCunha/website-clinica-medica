import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Clinica from "../../services/entities/clinica";
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
                    .required("Coloque o CNPJ da cl??nica."),
                name: Yup.string().trim()
                    .required("Coloque o nome da cl??nica."),
                municipalInscription: Yup.string().trim()
                    .required("Coloque a inscri????o estadual da cl??nica."),
                business: Yup.string().trim()
                    .required("Coloque a atividade da cl??nica."),
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

            let clinicData = {
                nome: data.name,
                cnpj: normalize(data.cnpj),
                endereco: concatenateAddress({ ...data }),
                inscricaoMunicipal: data.municipalInscription,
                atividade: data.business
            };

            if (!isEdition) {
                await postClinicHttp(clinicData).then(() => {
                    setWarning(["success", "Cl??nica m??dica cadastrada com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar a cl??nica m??dica."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedClinic !== undefined) {
                await putClinicHttp({
                    ...clinicData,
                    idClinica: editedClinic.idClinica
                }).then(() => {
                    setWarning(["success", "Cl??nica m??dica editada com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar a Cl??nica m??dica."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                clinicFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos da Cl??nica m??dica inv??lidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} cl??nica | CM`);

    return (
        <>
            <h1>Dados da Cl??nica M??dica</h1>

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
                    label='Inscri????o estadual'
                    placeholder='Coloque a inscri????o estadual'
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
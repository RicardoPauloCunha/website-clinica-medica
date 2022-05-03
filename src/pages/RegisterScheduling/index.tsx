import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import Medico from "../../services/entities/medico";
import Paciente from "../../services/entities/paciente";
import Servico from "../../services/entities/servico";
import { listDoctorBySpecialtyHttp } from "../../services/http/doctor";
import { getPatientByCpfHttp, postPatientHttp, _listPatient } from "../../services/http/patient";
import { listServiceHttp } from "../../services/http/service";
import { WarningTuple } from "../../util/getHttpErrors";
import { concatenateAddressData, normalize, normalizeDate, splitAddressData } from "../../util/stringFormat";
import * as Yup from "yup";
import getValidationErrors from "../../util/getValidationErrors";
import { getValueGenderType, listGenderType } from "../../services/enums/genderType";
import Warning from "../../components/Warning";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import LoadingButton from "../../components/LoadingButton";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import { Alert, Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import MaskInput from "../../components/Input/mask";
import DataCard from "../../components/DataCard";
import { numberToCurrency } from "../../util/convertCurrency";
import DataText from "../../components/DataText";
import { postSchedulingHttp } from "../../services/http/scheduling";
import { useAuth } from "../../contexts/auth";
import { getEnumScheduleStatus } from "../../services/enums/scheduleStatus";

type SchedulingFormData = {
    serviceId: number;
    doctorId: number;
    time: string;
    date: string;
    patientCpf: string;
}

type PatientFormData = {
    cpf: string;
    name: string;
    birthDate: string;
    gender: number;
    contact: string;
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
}

type ModalString = "patient" | "";

const RegisterScheduling = () => {
    const schedulingFormRef = useRef<FormHandles>(null);
    const patientFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _itemPatient = _listPatient[0];
    const _itemAddress = splitAddressData(_itemPatient.endereco);
    const _genderTypes = listGenderType();

    const [isLoading, setIsLoading] = useState<"scheduling" | "patient" | "getPatient" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const [services, setServices] = useState<Servico[]>([]);
    const [doctors, setDoctors] = useState<Medico[]>([]);
    const [serviceIndex, setServiceIndex] = useState(-1);
    const [doctorIndex, setDoctorIndex] = useState(-1);
    const [patient, setPatient] = useState<Paciente | undefined>(undefined);

    useEffect(() => {
        getServices();
        // eslint-disable-next-line
    }, []);

    const getServices = () => {
        listServiceHttp().then(response => {
            setServices([...response]);
        });
    }

    const getDoctors = (specialtyId: number | null) => {
        listDoctorBySpecialtyHttp({
            idEspecialidade: specialtyId
        }).then(response => {
            setDoctors([...response]);
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const searchPatient = () => {
        setWarning(["", ""]);
        schedulingFormRef.current?.setFieldError("patientCpf", "");
        let cpf = normalize(schedulingFormRef.current?.getFieldValue("patientCpf"));

        if (cpf.length !== 11) {
            schedulingFormRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        setIsLoading("getPatient");
        getPatientByCpfHttp({
            cpf
        }).then(response => {
            if (response.length === 0) {
                setWarning(["danger", "Paciente não encontrado. Adicione o paciente para prosseguir."]);
                return;
            }

            setPatient(response[0]);

            setWarning(["success", "Paciente encontrado."]);
            setTimeout(() => {
                setWarning(["", ""]);
            }, 2000);
        }).catch(() => {
            setWarning(["danger", "Paciente não encontrado. Adicione o paciente para prosseguir o agendamento."]);
        }).finally(() => setIsLoading(""));
    }

    const submitSchedulingForm: SubmitHandler<SchedulingFormData> = async (data, { reset }) => {
        try {
            setIsLoading("scheduling");
            setWarning(["", ""]);
            schedulingFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                serviceId: Yup.string().trim()
                    .required("Selecione o serviço para o agendamento."),
                doctorId: Yup.string().trim()
                    .required("Selecione o médico que realizará o serviço."),
                time: Yup.string().trim()
                    .required("Coloque o hórario."),
                date: Yup.string()
                    .required("Coloque a data."),
                patientCpf: Yup.string()
                    .required("Coloque o CPF do paciente.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            if (patient === undefined || patient.cpf !== data.patientCpf) {
                setIsLoading("");
                setWarning(["warning", "Campos do agendamento inválidos."]);
                schedulingFormRef.current?.setFieldError("patientCpf", "Busque o paciente pelo CPF para prosseguir.");
                return;
            }

            data.doctorId = Number(data.doctorId);
            data.serviceId = Number(data.serviceId);

            postSchedulingHttp({
                recepcionistaId: loggedUser?.idEmployee as number,
                pacienteCpf: data.patientCpf,
                medicoId: data.doctorId,
                dataAgendada: data.date,
                horaAgendada: data.time,
                servicoId: data.serviceId,
                status: getEnumScheduleStatus("scheduled")
            }).then(() => {
                setWarning(["success", "Agendamento cadastrado com sucesso."]);
                reset();
                setServiceIndex(-1);
                setDoctorIndex(-1);
                setPatient(undefined);
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o agendamento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                schedulingFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do agendamento inválidos."]);
            setIsLoading("");
        }
    }

    const submitPatientForm: SubmitHandler<PatientFormData> = async (data, { reset }) => {
        try {
            setIsLoading("patient");
            setWarning(["", ""]);
            schedulingFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                cpf: Yup.string().trim()
                    .required("Coloque o CPF do paciente."),
                name: Yup.string().trim()
                    .required("Coloque o nome do paciente."),
                birthDate: Yup.string().trim()
                    .required("Coloque a data de nascimento do paciente."),
                gender: Yup.string().trim()
                    .required("Selecione o gênero."),
                contact: Yup.string().trim()
                    .required("Coloque o contato (telefone) do paciente."),
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

            data.gender = Number(data.gender);

            postPatientHttp({
                cpf: data.cpf,
                nome: data.name,
                dataNascimento: normalizeDate(data.birthDate),
                sexo: data.gender,
                endereco: concatenateAddressData({ ...data }),
                contato: data.contact
            }).then(response => {
                toggleModal();
                setWarning(["success", "Paciente adicionado e selecionado com sucesso."]);
                setPatient(response);
                reset();

                setTimeout(() => {
                    schedulingFormRef.current?.setFieldValue("patientCpf", response.cpf);
                }, 100);
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o paciente."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                schedulingFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do paciente inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeService = (optionValue: string) => {
        let serviceId = Number(optionValue);
        let index = services.findIndex(x => x.idServico === serviceId);
        setServiceIndex(index);

        getDoctors(serviceId);
    }

    const handlerChangeDoctor = (optionValue: string) => {
        let doctorId = Number(optionValue);
        let index = doctors.findIndex(x => x.idFuncionario === doctorId);
        setDoctorIndex(index);
    }

    return (
        <>
            <h1>Cadastro de agendamento</h1>

            <Form
                ref={schedulingFormRef}
                onSubmit={submitSchedulingForm}
                className="form-data"
                initialData={{
                    time: "13:00",
                    date: "2022-05-30",
                    patientCpf: "411.716.944-07"
                }}
            >
                <SelectInput
                    name='serviceId'
                    label='Serviço'
                    placeholder='Selecione o serviço'
                    options={services.map(x => ({
                        value: x.idServico.toString(),
                        label: x.nomeServico
                    }))}
                    handlerChange={handlerChangeService}
                />

                <SelectInput
                    name='doctorId'
                    label='Médico'
                    placeholder='Selecione o médico'
                    options={doctors.map(x => ({
                        value: x.idFuncionario.toString(),
                        label: x.nomeFuncionario
                    }))}
                    handlerChange={handlerChangeDoctor}
                />

                <Row>
                    <Col md={6}>
                        <MaskInput
                            name='time'
                            label='Horário'
                            placeholder='00:00'
                            mask="99:99"
                            maskChar=""
                        />
                    </Col>

                    <Col md={6}>
                        <FieldInput
                            name='date'
                            label='Data'
                            placeholder='Selecione a data'
                            type="date"
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={10}>
                        <MaskInput
                            name='patientCpf'
                            label='CPF do paciente'
                            placeholder='000.000.000-00'
                            mask="999.999.999-99"
                            maskChar=""
                        />
                    </Col>

                    <Col md={2}>
                        <LoadingButton
                            text="Buscar"
                            isLoading={isLoading === "getPatient"}
                            type="button"
                            outline
                            onClick={() => searchPatient()}
                        />
                    </Col>
                </Row>

                <LoadingButton
                    text="Cadastrar"
                    isLoading={isLoading === "scheduling"}
                    type="submit"
                />

                {modal === "" && <Warning value={warning} />}
            </Form>

            <h2>Dados do fabricante</h2>

            {services[serviceIndex]
                ? <DataCard
                    title={services[serviceIndex].nomeServico}
                    subtitle={numberToCurrency(services[serviceIndex].valor)}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Descrição"
                            value={services[serviceIndex].descricaoServico}
                        />
                    </TextGroupGrid>
                </DataCard>
                : <Alert color="warning">
                    Nenhum serviço foi selecionado.
                </Alert>
            }

            <h2>Dados do médico</h2>

            {doctors[doctorIndex]
                ? <DataCard
                    title={doctors[doctorIndex].nomeFuncionario}
                    subtitle={doctors[doctorIndex].especialidade?.nomeEspecialidade}
                />
                : <Alert color="warning">
                    Nenhum médico foi selecionado.
                </Alert>
            }

            <h2>Dados do paciente</h2>

            {patient
                ? <DataCard
                    title={patient.nome}
                    subtitle={patient.cpf}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Data de nascimento"
                            value={patient.dataNascimento}
                        />

                        <DataText
                            label="Gênero"
                            value={getValueGenderType(undefined, patient.sexo)}
                        />

                        <DataText
                            label="Contato"
                            value={patient.contato}
                        />

                        <DataText
                            label="Endereço"
                            value={patient.endereco}
                        />
                    </TextGroupGrid>
                </DataCard>
                : <Alert color="warning">
                    Nenhum paciente foi selecionado.
                </Alert>
            }

            <h2>Adicionar paciente</h2>
            <p>Você pode adicionar uma novo paciente caso a busca pelo CPF não tenha encontrado nada.</p>

            <Button
                onClick={() => toggleModal("patient")}
                outline
            >
                Adicionar paciente
            </Button>

            <DataModal
                isOpen={modal === "patient"}
                toggle={toggleModal}
                centered
                size="lg"
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Adicionar paciente
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={patientFormRef}
                        onSubmit={submitPatientForm}
                        className="form-modal"
                        initialData={{
                            cpf: _itemPatient.cpf,
                            name: _itemPatient.nome,
                            birthDate: _itemPatient.dataNascimento,
                            gender: _itemPatient.sexo,
                            contact: _itemPatient.contato,
                            cep: _itemAddress.cep,
                            street: _itemAddress.street,
                            number: _itemAddress.number,
                            district: _itemAddress.district,
                            city: _itemAddress.city,
                            state: _itemAddress.state,
                        }}
                    >
                        <MaskInput
                            name='cpf'
                            label='CPF'
                            mask="999.999.999-99"
                            maskChar=""
                            placeholder='000.000.000-00'
                        />

                        <FieldInput
                            name='name'
                            label='Nome do paciente'
                            placeholder='Coloque o nome do paciente'
                        />

                        <MaskInput
                            name='birthDate'
                            label='Data de nascimento'
                            mask="99/99/9999"
                            maskChar=""
                            placeholder='00/00/0000'
                        />

                        <SelectInput
                            name='gender'
                            label='Gênero'
                            placeholder='Selecione o gênero'
                            options={_genderTypes.map((x, index) => ({
                                value: `${index + 1}`,
                                label: x
                            }))}
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

                        {modal === "patient" && <Warning value={warning} />}
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text="Adicionar paciente"
                        isLoading={isLoading === "patient"}
                        type='button'
                        onClick={() => patientFormRef.current?.submitForm()}
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

export default RegisterScheduling;
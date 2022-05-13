import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../contexts/auth";
import Medico from "../../services/entities/medico";
import Paciente from "../../services/entities/paciente";
import Servico from "../../services/entities/servico";
import ScheduleStatusEnum from "../../services/enums/scheduleStatus";
import { listGenderType } from "../../services/enums/genderType";
import { postSchedulingHttp } from "../../services/http/scheduling";
import { listDoctorByParamsHttp } from "../../services/http/doctor";
import { getPatientByCpfHttp, postPatientHttp, putPatientHttp } from "../../services/http/patient";
import { listServiceHttp } from "../../services/http/service";
import { WarningTuple } from "../../util/getHttpErrors";
import { normalize, normalizeDate } from "../../util/formatString";
import getValidationErrors from "../../util/getValidationErrors";
import { concatenateAddress, splitAddress } from "../../util/formatAddress";
import DocumentTitle from "../../util/documentTitle";

import { Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { DataModal, Form } from "../../styles/components";
import Warning from "../../components/Warning";
import LoadingButton from "../../components/LoadingButton";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import MaskInput from "../../components/Input/mask";
import ServiceCollapseCard from "../../components/CollapseCard/service";
import DoctorCollapseCard from "../../components/CollapseCard/doctor";
import PatientCollapseCard from "../../components/CollapseCard/patient";

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

    const _genderTypes = listGenderType();
    const minDate = new Date().toISOString().substring(0, 10);

    const [isLoading, setIsLoading] = useState<"scheduling" | "patient" | "getPatient" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [serviceIndex, setServiceIndex] = useState(-1);
    const [doctorIndex, setDoctorIndex] = useState(-1);
    const [isEditPatient, setIsEditPatient] = useState(false);

    const [services, setServices] = useState<Servico[]>([]);
    const [doctors, setDoctors] = useState<Medico[]>([]);
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

    const getDoctors = (specialtyId: number | undefined) => {
        listDoctorByParamsHttp({
            idEspecialidade: specialtyId
        }).then(response => {
            setDoctors([...response]);
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

    const searchPatient = () => {
        setWarning(["", ""]);
        schedulingFormRef.current?.setFieldError("patientCpf", "");
        let cpf = normalize(schedulingFormRef.current?.getFieldValue("patientCpf"));

        if (cpf.length !== 11) {
            schedulingFormRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        setIsLoading("getPatient");
        getPatientByCpfHttp(cpf).then(response => {
            setPatient(response);
            setWarning(["success", "Paciente encontrado."]);
        }).catch(() => {
            setWarning(["danger", "Paciente não encontrado. Adicione o paciente para prosseguir o agendamento."]);
        }).finally(() => setIsLoading(""));
    }

    const submitSchedulingForm: SubmitHandler<SchedulingFormData> = async (data, { reset }) => {
        try {
            if (loggedUser === undefined)
                return;

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

            data.patientCpf = normalize(data.patientCpf);

            if (patient === undefined || patient.cpf !== data.patientCpf) {
                setIsLoading("");
                setWarning(["warning", "Campos do agendamento inválidos."]);
                schedulingFormRef.current?.setFieldError("patientCpf", "Busque o paciente pelo CPF para prosseguir.");
                return;
            }

            data.doctorId = Number(data.doctorId);
            data.serviceId = Number(data.serviceId);

            postSchedulingHttp({
                recepcionistaId: loggedUser.employeeId,
                pacienteCpf: data.patientCpf,
                medicoId: data.doctorId,
                dataAgendada: data.date,
                horaAgendada: data.time,
                servicoId: data.serviceId,
                status: ScheduleStatusEnum.Scheduled
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
            patientFormRef.current?.setErrors({});

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

            let patientData = {
                cpf: normalize(data.cpf),
                nome: data.name,
                dataNascimento: normalizeDate(data.birthDate),
                sexo: Number(data.gender),
                endereco: concatenateAddress({ ...data }),
                contato: normalize(data.contact)
            }

            if (!isEditPatient) {
                postPatientHttp(patientData).then(response => {
                    setWarning(["success", "Paciente cadastrado e selecionado com sucesso."]);
                    setPatient(response);
                    toggleModal();
                    reset();

                    setTimeout(() => {
                        schedulingFormRef.current?.setFieldValue("patientCpf", response.cpf);
                    }, 100);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o paciente."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (patient) {
                putPatientHttp(patientData).then(() => {
                    setWarning(["success", "Paciente editado com sucesso."]);

                    setPatient({ ...patientData });
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o paciente."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                patientFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do paciente inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeService = (optionValue: string) => {
        let serviceId = Number(optionValue);
        let index = services.findIndex(x => x.idServico === serviceId);
        setServiceIndex(index);

        getDoctors(services[index].especialidade.idEspecialidade);
    }

    const handlerChangeDoctor = (optionValue: string) => {
        let doctorId = Number(optionValue);
        let index = doctors.findIndex(x => x.idFuncionario === doctorId);
        setDoctorIndex(index);
    }

    const onClickOpenPatient = (editPatient: boolean) => {
        setIsEditPatient(editPatient);

        if (editPatient && patient !== undefined) {
            let address = splitAddress(patient.endereco);

            setTimeout(() => {
                patientFormRef.current?.setData({
                    cpf: patient.cpf,
                    name: patient.nome,
                    birthDate: new Date(normalizeDate(patient.dataNascimento)).toLocaleDateString(),
                    gender: patient.sexo.toString(),
                    contact: patient.contato,
                    ...address
                });
            }, 100);
        }
        else if (!editPatient) {
            setTimeout(() => {
                patientFormRef.current?.reset();
            }, 100);
        }

        toggleModal("patient");
    }

    DocumentTitle("Cadastrar agendamento | CM");

    return (
        <>
            <h1>Cadastro de agendamento</h1>

            <Form
                ref={schedulingFormRef}
                onSubmit={submitSchedulingForm}
                className="form-data"
            >
                <Row>
                    <Col md={6}>
                        <FieldInput
                            name='date'
                            label='Data'
                            placeholder='Selecione a data'
                            type="date"
                            min={minDate}
                        />
                    </Col>

                    <Col md={6}>
                        <FieldInput
                            name='time'
                            label='Horário'
                            placeholder='Selecione o horário'
                            type="time"
                            min="08:00"
                            max="16:00"
                        />
                    </Col>
                </Row>

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

                {services[serviceIndex] && <ServiceCollapseCard
                    id={services[serviceIndex].idServico}
                    name={services[serviceIndex].nomeServico}
                    price={services[serviceIndex].valor}
                    description={services[serviceIndex].descricaoServico}
                />}

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

                {doctors[doctorIndex] && <DoctorCollapseCard
                    id={doctors[doctorIndex].idFuncionario}
                    name={doctors[doctorIndex].nomeFuncionario}
                    email={doctors[doctorIndex].email}
                    specialtyName={doctors[doctorIndex].especialidade.nomeEspecialidade}
                />}

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
                            color="secondary"
                            outline
                            onClick={() => searchPatient()}
                        />
                    </Col>
                </Row>

                {patient && <PatientCollapseCard
                    cpf={patient.cpf}
                    name={patient.nome}
                    contact={patient.contato}
                    address={patient.endereco}
                    onClickOpenPatient={onClickOpenPatient}
                />}

                {modal === "" && <Warning value={warning} />}

                <LoadingButton
                    text="Cadastrar"
                    isLoading={isLoading === "scheduling"}
                    type="submit"
                    color="secondary"
                />
            </Form>

            <h2>Adicionar paciente</h2>
            <p>Você pode adicionar uma novo paciente caso a busca pelo CPF não tenha encontrado nada.</p>

            <Button
                color="secondary"
                onClick={() => onClickOpenPatient(false)}
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
                    {isEditPatient ? "Editar" : "Adicionar"} paciente
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={patientFormRef}
                        onSubmit={submitPatientForm}
                        className="form-modal"
                    >
                        <MaskInput
                            name='cpf'
                            label='CPF'
                            mask="999.999.999-99"
                            maskChar=""
                            placeholder='000.000.000-00'
                            disabled={isEditPatient}
                        />

                        <FieldInput
                            name='name'
                            label='Nome'
                            placeholder='Coloque o nome'
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
                            label='Contato (celular)'
                            mask="(99) 99999-9999"
                            placeholder="(00) 00000-0000"
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
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text={isEditPatient ? "Editar" : "Adicionar"}
                        isLoading={isLoading === "patient"}
                        type='button'
                        color={isEditPatient ? "warning" : "secondary"}
                        onClick={() => patientFormRef.current?.submitForm()}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default RegisterScheduling;
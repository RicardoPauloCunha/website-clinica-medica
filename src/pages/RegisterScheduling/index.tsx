import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../contexts/auth";
import Medico from "../../services/entities/medico";
import Paciente from "../../services/entities/paciente";
import Servico from "../../services/entities/servico";
import ScheduleStatusEnum from "../../services/enums/scheduleStatus";
import { getValueGenderType, listGenderType } from "../../services/enums/genderType";
import { postSchedulingHttp } from "../../services/http/scheduling";
import { listDoctorByParamsHttp } from "../../services/http/doctor";
import { getPatientByCpfHttp, postPatientHttp, putPatientHttp, _listPatient } from "../../services/http/patient";
import { listServiceHttp } from "../../services/http/service";
import { WarningTuple } from "../../util/getHttpErrors";
import { formatCellphone, formatCpf, normalize, normalizeDate } from "../../util/formatString";
import getValidationErrors from "../../util/getValidationErrors";
import { formatCurrency } from "../../util/formatCurrency";
import { concatenateAddress, splitAddress } from "../../util/formatAddress";

import { Alert, Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import Warning from "../../components/Warning";
import LoadingButton from "../../components/LoadingButton";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import MaskInput from "../../components/Input/mask";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";

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

    const _itemPatient = _listPatient[2];
    const _itemAddress = splitAddress(_itemPatient.endereco);
    const _genderTypes = listGenderType();

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

    const getDoctors = (specialtyId: number | null) => {
        listDoctorByParamsHttp({
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
        getPatientByCpfHttp(cpf).then(response => {
            setPatient(response);

            setWarning(["success", "Paciente encontrado."]);
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
                recepcionistaId: loggedUser?.employeeId as number,
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
                schedulingFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do paciente inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeService = (optionValue: string) => {
        let serviceId = Number(optionValue);
        let index = services.findIndex(x => x.idServico === serviceId);
        setServiceIndex(index);

        getDoctors(services[serviceIndex].especialidade?.idEspecialidade as number);
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
                // patientFormRef.current?.reset();
                // TODO: descomentar
            }, 100);
        }

        toggleModal("patient");
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
                        <FieldInput
                            name='date'
                            label='Data'
                            placeholder='Selecione a data'
                            type="date"
                        />
                    </Col>

                    <Col md={6}>
                        <MaskInput
                            name='time'
                            label='Horário'
                            placeholder='00:00'
                            mask="99:99"
                            maskChar=""
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
                    subtitle={formatCurrency(services[serviceIndex].valor)}
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
                    subtitle={formatCpf(patient.cpf)}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Data de nascimento"
                            value={new Date(normalizeDate(patient.dataNascimento)).toLocaleDateString()}
                        />

                        <DataText
                            label="Gênero"
                            value={getValueGenderType(patient.sexo)}
                        />

                        <DataText
                            label="Contato"
                            value={formatCellphone(patient.contato)}
                        />

                        <DataText
                            label="Endereço"
                            value={patient.endereco}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        <Button
                            color="warning"
                            onClick={() => onClickOpenPatient(true)}
                        >
                            Editar
                        </Button>
                    </ButtonGroupRow>
                </DataCard>
                : <Alert color="warning">
                    Nenhum paciente foi selecionado.
                </Alert>
            }

            <h2>Adicionar paciente</h2>
            <p>Você pode adicionar uma novo paciente caso a busca pelo CPF não tenha encontrado nada.</p>

            <Button
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
                        initialData={{
                            cpf: _itemPatient.cpf,
                            name: _itemPatient.nome,
                            birthDate: new Date(normalizeDate(_itemPatient.dataNascimento)).toLocaleDateString(),
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
                            disabled={isEditPatient}
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
                        text={isEditPatient ? "Editar" : "Adicionar"}
                        isLoading={isLoading === "patient"}
                        type='button'
                        color={isEditPatient ? "warning" : "secondary"}
                        onClick={() => patientFormRef.current?.submitForm()}
                    />

                    <Button
                        color="dark"
                        outline
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
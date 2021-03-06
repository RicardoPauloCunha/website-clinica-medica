import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../contexts/auth";
import Agendamento from "../../services/entities/agendamento";
import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus, listScheduleStatus } from "../../services/enums/scheduleStatus";
import { listDoctorSchedulingByParamsHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { postAttendanceHttp } from "../../services/http/attendance";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { normalize, normalizeDate } from "../../util/formatString";
import DocumentTitle from "../../util/documentTitle";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";
import StatusBadge from "../../components/StatusBadge";
import SchedulingCard from "../../components/DataCard/scheduling";

type AttendanceFormData = {
    comments: string;
    diagnosis: string;
}

type ModalString = "schedule" | "attendace" | "";

const DoctorSchedules = () => {
    const navigate = useNavigate();
    const filterFormRef = useRef<FormHandles>(null);
    const attendanceFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _scheduleStatus = listScheduleStatus();

    const [isLoading, setIsLoading] = useState<"get" | "attendance" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [periods] = useState<[string, string][]>([
        ["-30", "??ltimo m??s"],
        ["-7", "??ltima semana"],
        ["-1", "Ontem"],
        ["0", "Hoje"],
        ["1", "Amanh??"],
        ["7", "Pr??xima semana"],
        ["30", "Pr??ximo m??s"],
    ]);

    const [schedules, setSchedules] = useState<Agendamento[]>([]);
    const [scheduleIndex, setScheduleIndex] = useState(-1);

    useEffect(() => {
        getSchedules(undefined, undefined);
        // eslint-disable-next-line
    }, [loggedUser]);

    const getSchedules = (period: number | undefined, status: number | undefined) => {
        setWarning(["", ""]);

        if (loggedUser) {
            setIsLoading("get");
            listDoctorSchedulingByParamsHttp({
                idMedico: loggedUser.employeeId,
                periodo: period,
                status
            }).then(response => {
                setSchedules([...response]);

                if (response.length === 0)
                    setWarning(["warning", "Nenhum agendamento foi encontrado."]);

                setIsLoading("");
            });
        }
        else {
            setWarning(["warning", "Nenhum agendamento foi encontrado."]);
        }
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

    const sendChangeSchedulingStatus = async (index: number) => {
        schedules[index].status = ScheduleStatusEnum.Concluded;

        await putSchedulingHttp(schedules[index]).catch(() => {
            setWarning(["danger", "N??o foi poss??vel atualizar o status do agendamento."]);
            setIsLoading("");
        });
    }

    const submitAttendanceForm: SubmitHandler<AttendanceFormData> = async (data, { reset }) => {
        try {
            setIsLoading("attendance");
            setWarning(["", ""]);
            attendanceFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                comments: Yup.string().trim()
                    .required("Coloque as observa????es do atendimento."),
                diagnosis: Yup.string().trim()
                    .required("Coloque o diagn??stico do atendimento.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            await postAttendanceHttp({
                observacoes: data.comments,
                diagnostico: data.diagnosis,
                agendamento: schedules[scheduleIndex]
            }).then(() => {
                sendChangeSchedulingStatus(scheduleIndex).then(() => {
                    setWarning(["success", "Atendimento cadastrado com sucesso."]);
                    toggleModal();
                    reset();
                });
            }).catch(() => {
                setWarning(["danger", "N??o foi poss??vel cadastrar o atendimento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                attendanceFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do atendimento inv??lidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeScheduleStatus = (optionValue: string) => {
        let scheduleStatus = Number(optionValue);
        let period: number | undefined = Number(filterFormRef.current?.getFieldValue("period"));
        
        if (isNaN(period) || period === 0)
            period = undefined;

        getSchedules(period, scheduleStatus);
    }

    const handlerChangePeriod = (optionValue: string) => {
        let period = Number(optionValue);
        let scheduleStatus: number | undefined = Number(filterFormRef.current?.getFieldValue("scheduleStatus"));
        
        if (isNaN(scheduleStatus) || scheduleStatus === 0)
            scheduleStatus = undefined;

        getSchedules(period, scheduleStatus);
    }

    const onClickOpenSchedule = (scheduleId: number) => {
        let index = schedules.findIndex(x => x.idAgendamento === scheduleId);
        setScheduleIndex(index);
        toggleModal("schedule");

        // TODO: Busca atendimento do agendamento para consulta j?? concluidas
    }

    const onClickFinalizeAttendance = () => {
        toggleModal("attendace");
    }

    const onClickPatientAttendances = () => {
        navigate("/pacientes/" + normalize(schedules[scheduleIndex].paciente.cpf) + "/atendimentos");
    }

    DocumentTitle("Agendamentos m??dicos | CM");

    return (
        <>
            <h1>Lista de agendamentos do m??dico</h1>

            <Form
                ref={filterFormRef}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='scheduleStatus'
                    label='Status do agendamento'
                    placeholder='Filtrar pelo status do agendamento'
                    options={_scheduleStatus.map((x, index) => ({
                        value: `${index + 1}`,
                        label: x
                    }))}
                    handlerChange={handlerChangeScheduleStatus}
                />

                <SelectInput
                    name='period'
                    label='Filtro de per??odo'
                    placeholder='Filtrar pela data de agendamento'
                    options={periods.map(x => ({
                        value: x[0],
                        label: x[1]
                    }))}
                    handlerChange={handlerChangePeriod}
                />

                {modal === "" && <Warning value={warning} />}
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {schedules.map(x => (
                <SchedulingCard
                    key={x.idAgendamento}
                    id={x.idAgendamento}
                    patientName={x.paciente.nome}
                    time={x.horaAgendada}
                    date={x.dataAgendada}
                    status={x.status}
                    serviceName={x.servico.especialidade.nomeEspecialidade}
                    onClickOpenSchedule={onClickOpenSchedule}
                />
            ))}

            <DataModal
                isOpen={modal === "schedule"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Dados do agendamento
                </ModalHeader>

                <ModalBody>
                    {schedules[scheduleIndex] && <TextGroupGrid
                        className="text-group-grid-modal"
                    >
                        <DataText
                            label="Paciente"
                            value={schedules[scheduleIndex].paciente.nome}
                            isFullRow={true}
                        />

                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(schedules[scheduleIndex].data)).toLocaleDateString()}
                        />

                        <DataText
                            label="Data agendada"
                            value={new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}
                        />

                        <StatusBadge
                            label="Status"
                            status={schedules[scheduleIndex].status}
                            value={getValueScheduleStatus(schedules[scheduleIndex].status)}
                            defineColor={defineColorScheduleStatus}
                        />

                        <DataText
                            label="Servi??o"
                            value={schedules[scheduleIndex].servico.nomeServico}
                            isFullRow={true}
                        />
                    </TextGroupGrid>}
                </ModalBody>

                <ModalFooter>
                    {schedules[scheduleIndex]?.status === ScheduleStatusEnum.Progress && <Button
                        color="secondary"
                        onClick={() => onClickFinalizeAttendance()}
                    >
                        Atendimento
                    </Button>}

                    {(schedules[scheduleIndex]?.status === ScheduleStatusEnum.Progress
                        || schedules[scheduleIndex]?.status === ScheduleStatusEnum.Concluded) && <Button
                            color="info"
                            outline
                            onClick={() => onClickPatientAttendances()}
                        >
                            Hist??rico
                        </Button>}
                </ModalFooter>
            </DataModal>

            <DataModal
                isOpen={modal === "attendace"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Finalizar atendimento
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={attendanceFormRef}
                        onSubmit={submitAttendanceForm}
                        className="form-modal"
                    >
                        <FieldInput
                            name='comments'
                            label='Observa????es'
                            placeholder='Coloque as observa????es'
                            type="textarea"
                            rows="4"
                        />

                        <FieldInput
                            name='diagnosis'
                            label='Diagn??stico'
                            placeholder='Coloque o diagn??stico'
                            type="textarea"
                            rows="4"
                        />

                        <Warning value={warning} />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text="Finalizar"
                        isLoading={isLoading === "attendance"}
                        type="button"
                        color="secondary"
                        onClick={() => attendanceFormRef.current?.submitForm()}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default DoctorSchedules;
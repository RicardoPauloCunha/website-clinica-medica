import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../contexts/auth";
import Agendamento from "../../services/entities/agendamento";
import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus } from "../../services/enums/scheduleStatus";
import { listDoctorSchedulingByParamsHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { postAttendanceHttp } from "../../services/http/attendance";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { normalize, normalizeDate } from "../../util/formatString";

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
    const attendanceFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const [isLoading, setIsLoading] = useState<"get" | "attendance" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [periods] = useState<[string, string][]>([
        ["-30", "Último mês"],
        ["-7", "Última semana"],
        ["-1", "Ontem"],
        ["0", "Hoje"],
        ["1", "Amanhã"],
        ["7", "Próxima semana"],
        ["30", "Próximo mês"],
    ]);

    const [schedules, setSchedules] = useState<Agendamento[]>([]);
    const [scheduleIndex, setScheduleIndex] = useState(-1);

    useEffect(() => {
        getSchedules(undefined);
        // eslint-disable-next-line
    }, [loggedUser]);

    const getSchedules = (period: number | undefined) => {
        setWarning(["", ""]);

        if (loggedUser) {
            setIsLoading("get");
            listDoctorSchedulingByParamsHttp({
                idMedico: loggedUser.employeeId,
                periodo: period
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
            setWarning(["danger", "Não foi possível atualizar o status do agendamento."]);
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
                    .required("Coloque as observações do atendimento."),
                diagnosis: Yup.string().trim()
                    .required("Coloque o diagnóstico do atendimento.")
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
                setWarning(["danger", "Não foi possível cadastrar o atendimento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                attendanceFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do atendimento inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangePeriod = (optionValue: string) => {
        let period = Number(optionValue);
        getSchedules(period);
    }

    const onClickOpenSchedule = (scheduleId: number) => {
        let index = schedules.findIndex(x => x.idAgendamento === scheduleId);
        setScheduleIndex(index);
        toggleModal("schedule");

        // TODO: Busca atendimento do agendamento para consulta já concluidas
    }

    const onClickFinalizeAttendance = () => {
        toggleModal("attendace");
    }

    const onClickPatientAttendances = () => {
        navigate("/pacientes/" + normalize(schedules[scheduleIndex].paciente.cpf) + "/atendimentos");
    }

    return (
        <>
            <h1>Lista de agendamentos do médico</h1>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='period'
                    label='Filtro de período'
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
                            label="Serviço"
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
                            Histórico
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
                            label='Observações'
                            placeholder='Coloque as observações'
                            type="textarea"
                            rows="4"
                        />

                        <FieldInput
                            name='diagnosis'
                            label='Diagnóstico'
                            placeholder='Coloque o diagnóstico'
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
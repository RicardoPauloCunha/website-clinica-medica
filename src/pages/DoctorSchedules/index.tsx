import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../contexts/auth";
import Agendamento from "../../services/entities/agendamento";
import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus } from "../../services/enums/scheduleStatus";
import { listDoctorSchedulingByParamsHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { postAttendanceHttp, _listAttendance } from "../../services/http/attendance";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import { normalize } from "../../util/formatString";

import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";
import StatusBadge from "../../components/StatusBadge";

type AttendanceFormData = {
    comments: string;
    diagnosis: string;
}

type ModalString = "attendace" | "";

const DoctorSchedules = () => {
    const navigate = useNavigate();
    const attendanceFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _itemAttendance = _listAttendance[0];

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
        getSchedules(0);
        // eslint-disable-next-line
    }, []);

    const getSchedules = (period: number) => {
        setWarning(["", ""]);

        if (loggedUser) {
            setIsLoading("get");
            listDoctorSchedulingByParamsHttp({
                funcionarioId: loggedUser.employeeId,
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
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const sendChangeSchedulingStatus = async (index: number) => {
        if (schedules[index] === undefined)
            return;

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
                agendamentoId: schedules[scheduleIndex].idAgendamento
            }).then(() => {
                sendChangeSchedulingStatus(scheduleIndex).then(() => {
                    setWarning(["success", "Atendimetno cadastrado com sucesso."]);
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

    const onClickPatientAttendances = (index: number) => {
        if (index === -1)
            return;

        navigate("/pacientes/" + normalize(schedules[index].paciente?.cpf) + "/atendimentos");
    }

    const onClickFinalizeAttendance = (index: number) => {
        setScheduleIndex(index);
        toggleModal("attendace");
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

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {schedules.map((x, index) => (
                <DataCard
                    key={x.idAgendamento}
                    title={x.paciente?.nome}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Serviço"
                            value={x.servico?.nomeServico}
                        />

                        <DataText
                            label="Data agendamento"
                            value={new Date(x.dataAgendada + "T" + x.horaAgendada).toLocaleString()}
                        />

                        <StatusBadge
                            label="Status"
                            status={x.status}
                            value={getValueScheduleStatus(x.status)}
                            defineColor={defineColorScheduleStatus}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        {x.status === ScheduleStatusEnum.Progress && <Button
                            color="primary"
                            outline
                            onClick={() => onClickPatientAttendances(index)}
                        >
                            Histórico do paciente
                        </Button>}

                        {x.status === ScheduleStatusEnum.Progress && <Button
                            color="success"
                            onClick={() => onClickFinalizeAttendance(index)}
                        >
                            Finalizar atendimento
                        </Button>}
                    </ButtonGroupRow>
                </DataCard>
            ))}

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
                        initialData={{
                            comments: _itemAttendance.observacoes,
                            diagnosis: _itemAttendance.diagnostico
                        }}
                    >
                        <FieldInput
                            name='comments'
                            label='Observações'
                            placeholder='Coloque as observações do atendimento'
                            type="textarea"
                            rows="4"
                        />

                        <FieldInput
                            name='diagnosis'
                            label='Diagnóstico'
                            placeholder='Coloque o diagnóstico do atendimento'
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
                        onClick={() => attendanceFormRef.current?.submitForm()}
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

export default DoctorSchedules;
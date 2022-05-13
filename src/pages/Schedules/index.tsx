import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles } from "@unform/core";

import Agendamento from "../../services/entities/agendamento";
import Pagamento from "../../services/entities/pagamento";
import Ressarcimento from "../../services/entities/ressarcimento";
import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus, listScheduleStatus } from "../../services/enums/scheduleStatus";
import PaymentStatusEnum from "../../services/enums/paymentStatus";
import { getValuePaymentMethodType } from "../../services/enums/paymentMethodType";
import { getRefundByPaymentIdHttp } from "../../services/http/refund";
import { listReceptionistSchedulingByParamsHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { getPaymentBySchedulingIdHttp } from "../../services/http/payment";
import { formatCurrency } from "../../util/formatCurrency";
import { WarningTuple } from "../../util/getHttpErrors";
import { formatCellphone, formatCpf, normalize, normalizeDate } from "../../util/formatString";
import DocumentTitle from "../../util/documentTitle";

import { Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataText from "../../components/DataText";
import MaskInput from "../../components/Input/mask";
import LoadingButton from "../../components/LoadingButton";
import StatusBadge from "../../components/StatusBadge";
import InvoiceModal from "../../components/InvoiceModal";
import SchedulingCard from "../../components/DataCard/scheduling";

type ModalString = "status" | "schedule" | "invoice" | "";

const Schedules = () => {
    const navigate = useNavigate();
    const filterFormRef = useRef<FormHandles>(null);

    const _scheduleStatus = listScheduleStatus();

    const [isLoading, setIsLoading] = useState<"get" | "status" | "payment" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");

    const [schedules, setSchedules] = useState<Agendamento[]>([]);
    const [scheduleIndex, setScheduleIndex] = useState(-1);
    const [payment, setPayment] = useState<Pagamento | undefined>(undefined);
    const [refund, setRefund] = useState<Ressarcimento | undefined>(undefined);

    useEffect(() => {
        getSchedules(undefined, undefined);
        // eslint-disable-next-line
    }, []);

    const getSchedules = (scheduleStatus: number | undefined, cpf: string | undefined) => {
        setWarning(["", ""]);

        scheduleStatus = scheduleStatus === 0 ? undefined : scheduleStatus;

        setIsLoading("get");
        listReceptionistSchedulingByParamsHttp({
            cpf: cpf,
            status: scheduleStatus
        }).then(response => {
            setSchedules([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum agendamento foi encontrado."]);

            setIsLoading("");
        });
    }

    const getPayment = async (scheduleId: number) => {
        getPaymentBySchedulingIdHttp(scheduleId).then(response => {
            setPayment(response);

            if (response.status === PaymentStatusEnum.Reimbursed)
                getRefund(response.idPagamento);
            else
                setRefund(undefined);
        });
    }

    const getRefund = (paymentId: number) => {
        getRefundByPaymentIdHttp(paymentId).then(response => {
            setRefund(response);
        });
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

    const sendChangeStatus = () => {
        setIsLoading("status");

        schedules[scheduleIndex].status = ScheduleStatusEnum.Unchecked

        putSchedulingHttp(schedules[scheduleIndex]).then(() => {
            setWarning(["success", "Status do agendamento editado com sucesso."]);
            toggleModal();
        }).catch(() => {
            setWarning(["danger", "Não foi possível editar o status do agendamento."]);
        }).finally(() => { setIsLoading(""); })
    }

    const handlerChangeScheduleStatus = (optionValue: string) => {
        let scheduleStatus = Number(optionValue);

        let cpf: string | undefined = normalize(filterFormRef.current?.getFieldValue("patientCpf"));

        if (cpf.length !== 11)
            cpf = undefined;

        getSchedules(scheduleStatus, cpf);
    }

    const handlerSearchScheduleByCpf = () => {
        setWarning(["", ""]);
        filterFormRef.current?.setFieldError("patientCpf", "");
        let cpf = normalize(filterFormRef.current?.getFieldValue("patientCpf"));

        if (cpf.length !== 11) {
            filterFormRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        let scheduleStatus: number | null = Number(filterFormRef.current?.getFieldValue("scheduleStatus"));

        getSchedules(scheduleStatus, cpf);
    }

    const onClickOpenSchedule = (scheduleId: number) => {
        let index = schedules.findIndex(x => x.idAgendamento === scheduleId);
        setScheduleIndex(index);
        toggleModal("schedule");

        if (schedules[index].status === ScheduleStatusEnum.Scheduled
            || schedules[index].status === ScheduleStatusEnum.Unchecked) {
            setPayment(undefined);
            setRefund(undefined);
            return;
        }

        setIsLoading("payment");
        getPayment(scheduleId).then(() => {
            setIsLoading("");
        });
    }

    const onClickOpenInvoice = () => {
        if (payment === undefined)
            return;

        toggleModal("invoice");
    }

    const onClickChangeStatus = () => {
        toggleModal("status");
    }

    const onClickConfirmPayment = () => {
        navigate("/agendamentos/" + schedules[scheduleIndex].idAgendamento + "/pagamento/confirmar");
    }

    const onClickPaymentRefund = () => {
        if (payment === undefined)
            return;

        navigate("/agendamentos/" + payment.agendamento.idAgendamento + "/pagamento/" + payment.idPagamento + "/ressarcir");
    }

    DocumentTitle("Agendamentos | CM");

    return (
        <>
            <h1>Lista de agendamentos</h1>

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
                        <Button
                            type="button"
                            color="secondary"
                            outline
                            onClick={() => handlerSearchScheduleByCpf()}
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>

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
                    doctorName={x.medico.nomeFuncionario}
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
                            label="CPF"
                            value={formatCpf(schedules[scheduleIndex].paciente.cpf)}
                        />

                        <DataText
                            label="Contato"
                            value={formatCellphone(schedules[scheduleIndex].paciente.contato)}
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

                        <DataText
                            label="Médico"
                            value={schedules[scheduleIndex].medico.nomeFuncionario}
                        />
                    </TextGroupGrid>}

                    {payment !== undefined && <>
                        <h5>Dados do pagamento</h5>

                        <TextGroupGrid
                            className="text-group-grid-modal"
                        >
                            <DataText
                                label="Preço"
                                value={formatCurrency(payment.valor)}
                            />

                            <DataText
                                label="Desconto"
                                value={formatCurrency(payment.desconto)}
                            />

                            <DataText
                                label="Forma de pagamento"
                                value={getValuePaymentMethodType(payment.formaDePagamento)}
                            />

                            <DataText
                                label="Data"
                                value={new Date(normalizeDate(payment.data)).toLocaleDateString()}
                            />
                        </TextGroupGrid>
                    </>}

                    {refund !== undefined && <>
                        <h5>Dados do ressarcimento</h5>

                        <TextGroupGrid
                            className="text-group-grid-modal"
                        >
                            <DataText
                                label="Preço"
                                value={formatCurrency(refund.valor)}
                                isFullRow={true}
                            />

                            <DataText
                                label="Forma de pagamento"
                                value={getValuePaymentMethodType(refund.formaDeRessarcimento)}
                            />

                            <DataText
                                label="Data"
                                value={new Date(normalizeDate(refund.data)).toLocaleDateString()}
                            />

                            <DataText
                                label="Descrição do motivo"
                                value={refund.motivoRessarcimento}
                                isFullRow={true}
                            />
                        </TextGroupGrid>
                    </>}

                    {isLoading === "payment" && <SpinnerBlock />}
                </ModalBody>

                <ModalFooter>
                    {schedules[scheduleIndex]?.status === ScheduleStatusEnum.Scheduled && <>
                        <Button
                            color="secondary"
                            onClick={() => onClickConfirmPayment()}
                        >
                            Pagamento
                        </Button>

                        <Button
                            color="danger"
                            outline
                            onClick={() => onClickChangeStatus()}
                        >
                            Desmarcar
                        </Button>
                    </>}

                    {(schedules[scheduleIndex]?.status === ScheduleStatusEnum.Progress
                        || schedules[scheduleIndex]?.status === ScheduleStatusEnum.Concluded) && <Button
                            color="info"
                            onClick={() => onClickOpenInvoice()}
                        >
                            Nota fiscal {refund === undefined ? "pagamento" : "ressarcimento"}
                        </Button>}

                    {payment !== undefined && refund === undefined && <Button
                        color="danger"
                        outline
                        onClick={() => onClickPaymentRefund()}
                    >
                        Ressarcir
                    </Button>}
                </ModalFooter>
            </DataModal>

            <DataModal
                isOpen={modal === "status"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Desmarcar agendamento
                </ModalHeader>

                {schedules[scheduleIndex] && <ModalBody>
                    <p>
                        Tem certeza que deseja desmarcar o agendamento do paciente <b>{schedules[scheduleIndex].paciente.nome}</b> para o dia <b>{new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}</b>?
                    </p>

                    <Warning value={warning} />
                </ModalBody>}

                <ModalFooter>
                    <LoadingButton
                        text="Desmarcar"
                        isLoading={isLoading === "status"}
                        color="danger"
                        onClick={() => sendChangeStatus()}
                    />
                </ModalFooter>
            </DataModal>

            <InvoiceModal
                showModal={modal === "invoice"}
                toggleModal={toggleModal}
                invoice={refund !== undefined ? refund.notaFiscal : payment?.notaFiscal}
                patient={schedules[scheduleIndex]?.paciente}
            />
        </>
    );
}

export default Schedules;
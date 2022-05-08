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

import { Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import MaskInput from "../../components/Input/mask";
import LoadingButton from "../../components/LoadingButton";
import StatusBadge from "../../components/StatusBadge";
import InvoiceModal from "../../components/InvoiceModal";

type ModalString = "status" | "payment" | "invoice" | "";

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
        getSchedules(ScheduleStatusEnum.Progress, null);
        // eslint-disable-next-line
    }, []);

    const getSchedules = (scheduleStatus: number | null, cpf: string | null) => {
        setWarning(["", ""]);

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

    const getPayment = async (scheduleIndex: number) => {
        getPaymentBySchedulingIdHttp(schedules[scheduleIndex].idAgendamento).then(response => {
            setPayment(response);

            if (response?.status === PaymentStatusEnum.Reimbursed)
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
        setModal(modalName !== undefined ? modalName : "");
        setWarning(["", ""]);
    }

    const sendChangeStatus = () => {
        if (scheduleIndex === -1)
            return;

        setIsLoading("status");

        schedules[scheduleIndex].status = ScheduleStatusEnum.Unchecked

        putSchedulingHttp(schedules[scheduleIndex]).then(() => {
            setIsLoading("");
            toggleModal();
        });
    }

    const handlerChangeScheduleStatus = (optionValue: string) => {
        let scheduleStatus = Number(optionValue);

        let cpf: string | null = normalize(filterFormRef.current?.getFieldValue("patientCpf"));

        if (cpf.length !== 11)
            cpf = null

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

        let scheduleStatus: number | null = Number(normalize(filterFormRef.current?.getFieldValue("scheduleStatus")));

        getSchedules(scheduleStatus, cpf);
    }

    const onClickConfirmPayment = (index: number) => {
        if (index === -1)
            return;

        navigate("/agendamentos/" + schedules[index].idAgendamento + "/pagamento/confirmar");
    }

    const onClickOpenPayment = (index: number) => {
        setScheduleIndex(index);
        toggleModal("payment");
        
        setIsLoading("payment");
        getPayment(index).then(() => {
            setIsLoading("");
        });
    }

    const onClickOpenInvoice = () => {
        if (payment === undefined)
            return;

        toggleModal("invoice");
    }

    const onClickChangeStatus = (index: number) => {
        setScheduleIndex(index);
        toggleModal("status");
    }

    const onClickPaymentRefund = () => {
        if (payment === undefined)
            return;

        navigate("/agendamentos/" + payment.agendamento?.idAgendamento + "/pagamento/" + payment.idPagamento + "/ressarcir");
    }

    return (
        <>
            <h1>Lista de agendamentos</h1>

            <Form
                ref={filterFormRef}
                onSubmit={() => { }}
                className="form-search"
                initialData={{
                    scheduleStatus: `${ScheduleStatusEnum.Scheduled}`
                }}
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
                            onClick={() => handlerSearchScheduleByCpf()}
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {schedules.map((x, index) => (
                <DataCard
                    key={x.idAgendamento}
                    title={x.paciente?.nome}
                    subtitle={formatCpf(x.paciente?.cpf)}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Contato"
                            value={formatCellphone(x.paciente?.contato)}
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

                        <DataText
                            label="Serviço"
                            value={x.servico?.nomeServico}
                        />

                        <DataText
                            label="Médico"
                            value={x.medico?.nomeFuncionario}
                        />

                        <DataText
                            label="Especialidade"
                            value={x.medico?.especialidade?.nomeEspecialidade}
                        />

                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(x.data)).toLocaleDateString()}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        {(x.status === ScheduleStatusEnum.Progress
                            || x.status === ScheduleStatusEnum.Concluded) && <Button
                                color="primary"
                                outline
                                onClick={() => onClickOpenPayment(index)}
                            >
                                Visualizar pagamento
                            </Button>}

                        {x.status === ScheduleStatusEnum.Scheduled && <>
                            <Button
                                color="danger"
                                outline
                                onClick={() => onClickChangeStatus(index)}
                            >
                                Desmarcar
                            </Button>

                            <Button
                                color="success"
                                onClick={() => onClickConfirmPayment(index)}
                            >
                                Confirmar pagamento
                            </Button>
                        </>}
                    </ButtonGroupRow>
                </DataCard>
            ))}

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
                    Tem certeza que deseja desmarcar o agendamento do paciente <b>{schedules[scheduleIndex].paciente?.nome}</b> para o dia <b>{new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}</b>?
                </ModalBody>}

                <ModalFooter>
                    <LoadingButton
                        text="Desmarcar"
                        isLoading={isLoading === "status"}
                        color="danger"
                        onClick={() => sendChangeStatus()}
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

            <DataModal
                isOpen={modal === "payment"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Dados do pagamento
                </ModalHeader>

                <ModalBody>
                    {payment !== undefined && <TextGroupGrid
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
                    </TextGroupGrid>}

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
                    <Button
                        color="primary"
                        outline
                        onClick={() => onClickOpenInvoice()}
                    >
                        Nota fiscal {refund === undefined ? "pagamento" : "ressarcimento"}
                    </Button>

                    {refund === undefined && <Button
                        color="danger"
                        onClick={() => onClickPaymentRefund()}
                    >
                        Ressarcir
                    </Button>}

                    <Button
                        color="dark"
                        outline
                        onClick={() => toggleModal()}
                    >
                        Cancelar
                    </Button>
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
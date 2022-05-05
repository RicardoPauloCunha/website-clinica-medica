import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormHandles } from "@unform/core";

import ScheduleStatusEnum, { getValueScheduleStatus, listScheduleStatus } from "../../services/enums/scheduleStatus";
import PaymentStatusEnum, { } from "../../services/enums/paymentStatus";
import { getValuePaymentMethodType } from "../../services/enums/paymentMethodType";
import Agendamento from "../../services/entities/agendamento";
import Pagamento from "../../services/entities/pagamento";
import Ressarcimento from "../../services/entities/ressarcimento";
import { getRefundByPaymentIdHttp } from "../../services/http/refund";
import { listReceptionistSchedulingByParamsHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { getPaymentBySchedulingIdHttp } from "../../services/http/payment";
import { numberToCurrency } from "../../util/convertCurrency";
import { WarningTuple } from "../../util/getHttpErrors";
import { normalize } from "../../util/stringFormat";

import { Button, Col, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap";
import { ButtonGroupRow, DataModal, Form, TextGroupGrid } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import MaskInput from "../../components/Input/mask";

type ModalString = "status" | "payment" | "";

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
        getSchedules(null, null);
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
        setPayment(undefined);
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

        navigate("/agendamentos/" + schedules[index].idAgendamento + "/confirmar-pagamento");
    }

    const onClickOpenPayment = (index: number) => {
        setIsLoading("payment");
        setScheduleIndex(index);
        toggleModal("payment");

        getPayment(index).then(() => {
            setIsLoading("");
        });
    }

    const onClickChangeStatus = (index: number) => {
        setScheduleIndex(index);
        toggleModal("status");
    }

    const onClickInvoice = () => {
        if (payment === undefined)
            return;

        navigate("/pagamentos/" + payment.idPagamento + "/nota-fiscal");
    }

    const onClickPaymentRefund = () => {
        if (payment === undefined)
            return;

        navigate("/pagamentos/" + payment.idPagamento + "/ressarcir");
    }

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
                            outline
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
                    title={x.paciente?.nome as string}
                    subtitle={x.paciente?.cpf}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Contato"
                            value={x.paciente?.contato as string}
                        />

                        <DataText
                            label="Serviço"
                            value={x.servico?.nomeServico as string}
                        />

                        <DataText
                            label="Data cadastro"
                            value={new Date(x.data).toLocaleDateString()}
                        />

                        <DataText
                            label="Data agendamento"
                            value={new Date(x.dataAgendada + "T" + x.horaAgendada).toLocaleString()}
                        />

                        <DataText
                            label="Status agendamento"
                            value={getValueScheduleStatus(x.status)}
                        />

                        <DataText
                            label="Médico"
                            value={x.medico?.nomeFuncionario as string}
                        />

                        <DataText
                            label="Especialidade"
                            value={x.medico?.especialidade?.nomeEspecialidade as string}
                        />
                    </TextGroupGrid>

                    <ButtonGroupRow>
                        {(x.status === ScheduleStatusEnum.Progress
                            || x.status === ScheduleStatusEnum.Concluded) && <Button
                                outline
                                color="success"
                                onClick={() => onClickOpenPayment(index)}
                            >
                                Visualizar pagamento
                            </Button>}

                        {x.status === ScheduleStatusEnum.Scheduled && <>
                            <Button
                                color="success"
                                onClick={() => onClickConfirmPayment(index)}
                            >
                                Confirmar pagamento
                            </Button>

                            <Button
                                color="danger"
                                onClick={() => onClickChangeStatus(index)}
                            >
                                Desmarcar
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
                    <Button
                        color="danger"
                        onClick={() => sendChangeStatus()}
                    >
                        {isLoading === "status"
                            ? <Spinner size="sm" />
                            : "Desmarcar"
                        }
                    </Button>

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancel
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
                            value={numberToCurrency(payment.valor)}
                        />

                        <DataText
                            label="Desconto"
                            value={numberToCurrency(payment.desconto)}
                        />

                        <DataText
                            label="Forma de pagamento"
                            value={getValuePaymentMethodType(payment.formaDePagamento)}
                        />

                        <DataText
                            label="Data"
                            value={new Date(payment.data).toLocaleDateString()}
                        />
                    </TextGroupGrid>}

                    {refund !== undefined && <>
                        <h5>Dados do ressarcimento</h5>

                        <TextGroupGrid
                            className="text-group-grid-modal"
                        >
                            <DataText
                                label="Preço"
                                value={numberToCurrency(refund.valor)}
                                isFullRow={true}
                            />

                            <DataText
                                label="Forma de pagamento"
                                value={getValuePaymentMethodType(refund.formaDeRessarcimento)}
                            />

                            <DataText
                                label="Data"
                                value={new Date(refund.data).toLocaleDateString()}
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
                        outline
                        color="primary"
                        onClick={() => onClickInvoice()}
                    >
                        Nota fiscal
                    </Button>

                    {refund === undefined && <Button
                        outline
                        color="danger"
                        onClick={() => onClickPaymentRefund()}
                    >
                        Ressarcir
                    </Button>}

                    <Button
                        onClick={() => toggleModal()}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Schedules;
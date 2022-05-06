import { useEffect, useState } from "react";

import { WarningTuple } from "../../util/getHttpErrors";

import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import NotaFiscal from "../../services/entities/notaFiscal";
import { getInvoiceBySchedulingIdHttp, listInvoiceByParamsHttp } from "../../services/http/invoice";
import SelectInput from "../../components/Input/select";
import { Button, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { numberToCurrency } from "../../util/convertCurrency";
import { getValueInvoiceType } from "../../services/enums/invoiceType";
import { AddressData, formatCpf, splitAddressData } from "../../util/stringFormat";
import { useParams } from "react-router-dom";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import ScheduleStatusEnum, { getValueScheduleStatus } from "../../services/enums/scheduleStatus";

type ModalString = "invoice" | "";

const Invoices = () => {
    const routeParams = useParams();

    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [periods] = useState<[string, string][]>([
        ["-30", "Último mês"],
        ["-7", "Última semana"],
        ["0", "Hoje"]
    ]);

    const [invoices, setInvoices] = useState<NotaFiscal[]>([]);
    const [invoiceIndex, setInvoiceIndex] = useState(-1);
    const [address, setAddress] = useState<AddressData | undefined>(undefined);

    useEffect(() => {
        if (routeParams.paymentId !== undefined)
            getSchedulingInvoices();
        else
            getInvoices(0);
        // eslint-disable-next-line
    }, [routeParams]);

    const getInvoices = (period: number) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listInvoiceByParamsHttp({
            periodo: period
        }).then(response => {
            setInvoices([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhuma nota fiscal foi encontrada."]);

            setIsLoading("");
        });
    }

    const getSchedulingInvoices = () => {
        let id = Number(routeParams.paymentId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getInvoiceBySchedulingIdHttp(id).then(response => {
            setInvoices([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhuma nota fiscal foi encontrada."]);

            setIsLoading("");
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        setModal(modalName !== undefined ? modalName : "");
    }

    const handlerChangePeriod = (optionValue: string) => {
        let period = Number(optionValue);
        getInvoices(period);
    }

    const onClickOpenInvoice = (index: number) => {
        if (invoices[index] === undefined)
            return;

        let addressData = splitAddressData(invoices[index].pagamento?.agendamento?.paciente?.endereco as string);
        setAddress(addressData);
        setInvoiceIndex(index);
        toggleModal("invoice");
    }

    return (
        <>
            {routeParams.paymentId === undefined
                ? <>
                    <h1>Lista de notas fiscais</h1>

                    <Form
                        ref={null}
                        onSubmit={() => { }}
                        className="form-search"
                    >
                        <SelectInput
                            name='period'
                            label='Filtro de período'
                            placeholder='Filtrar pela data de emissão'
                            options={periods.map(x => ({
                                value: x[0],
                                label: x[1]
                            }))}
                            handlerChange={handlerChangePeriod}
                        />

                        <Warning value={warning} />
                    </Form>
                </>
                : <>
                    <h1>Lista de notas fiscais do agendamento</h1>
                    
                    <Warning value={warning} />
                </>
            }

            {isLoading === "get" && <SpinnerBlock />}

            {routeParams.paymentId !== undefined && invoices[0] !== undefined && <DataCard
                title={invoices[0].pagamento?.agendamento?.paciente?.nome as string}
                subtitle={invoices[0].pagamento?.agendamento?.paciente?.cpf}
            >
                <TextGroupGrid>
                    <DataText
                        label="Contato"
                        value={invoices[0].pagamento?.agendamento?.paciente?.contato as string}
                    />

                    <DataText
                        label="Serviço"
                        value={invoices[0].pagamento?.agendamento?.servico?.nomeServico as string}
                    />

                    <DataText
                        label="Data"
                        value={new Date(invoices[0].pagamento?.agendamento?.data as string).toLocaleDateString()}
                    />

                    <DataText
                        label="Data agendamento"
                        value={new Date(invoices[0].pagamento?.agendamento?.dataAgendada + "T" + invoices[0].pagamento?.agendamento?.horaAgendada).toLocaleString()}
                    />

                    <DataText
                        label="Status agendamento"
                        value={getValueScheduleStatus(invoices[0].pagamento?.agendamento?.status as ScheduleStatusEnum)}
                    />

                    <DataText
                        label="Médico"
                        value={invoices[0].pagamento?.agendamento?.medico?.nomeFuncionario as string}
                    />

                    <DataText
                        label="Especialidade"
                        value={invoices[0].pagamento?.agendamento?.medico?.especialidade?.nomeEspecialidade as string}
                    />
                </TextGroupGrid>
            </DataCard>}

            <Table
                hover
                responsive
                striped
                className={routeParams.paymentId !== undefined ? "mt-5" : ""}
            >
                <thead>
                    <tr>
                        <th>
                            Número
                        </th>
                        <th>
                            Data
                        </th>
                        <th>
                            Valor
                        </th>
                        <th>
                            Tipo
                        </th>
                        <th>
                            Visualizar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((x, index) => (
                        <tr key={x.idNotaFiscal}>
                            <th scope="row">
                                {x.idNotaFiscal}
                            </th>
                            <td>
                                {new Date(x.dataEmissao).toLocaleDateString()}
                            </td>
                            <td>
                                {numberToCurrency(x.valorNota)}
                            </td>
                            <td>
                                {getValueInvoiceType(x.tipoNotaFiscal)}
                            </td>
                            <td>
                                <small
                                    className="text-link-action"
                                    onClick={() => onClickOpenInvoice(index)}
                                >
                                    Abrir
                                </small>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <DataModal
                isOpen={modal === "invoice"}
                toggle={toggleModal}
                centered
                size="xl"
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Nota fiscal
                </ModalHeader>

                <ModalBody>
                    {invoices[invoiceIndex] !== undefined && <Table
                        bordered
                        responsive
                    >
                        <tbody>
                            <tr>
                                <th colSpan={4}>Nota fiscal de serviço prestado</th>
                            </tr>
                            <tr>
                                <th>Número</th>
                                <td>{invoices[invoiceIndex].idNotaFiscal}</td>
                                <th>Data</th>
                                <td>{new Date(invoices[invoiceIndex].dataEmissao).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th colSpan={4}>Prestador</th>
                            </tr>
                            <tr>
                                <th>Nome</th>
                                <td colSpan={3}>Clínica Médica</td>
                            </tr>
                            <tr>
                                <th>CNPJ</th>
                                <td>01.234.573/0001-64</td>
                                <th>Inscrição Municipal</th>
                                <td>0123456789</td>
                            </tr>
                            <tr>
                                <th>Endereço</th>
                                <td colSpan={3}>Rua Das Dores, 192 - Centro - 06060233</td>
                            </tr>
                            <tr>
                                <th>Município</th>
                                <td>Osasco</td>
                                <th>UF</th>
                                <td>SP</td>
                            </tr>
                            <tr>
                                <th colSpan={4}>Tomador</th>
                            </tr>
                            <tr>
                                <th>Nome</th>
                                <td colSpan={3}>{invoices[invoiceIndex].pagamento?.agendamento?.paciente?.nome}</td>
                            </tr>
                            <tr>
                                <th>CPF</th>
                                <td>{formatCpf(invoices[invoiceIndex].pagamento?.agendamento?.paciente?.cpf as string)}</td>
                                <th>Inscrição Municipal</th>
                                <td>-</td>
                            </tr>
                            <tr>
                                <th>Endereço</th>
                                <td colSpan={3}>{address?.street}, {address?.number} - {address?.district} - {address?.cep}</td>
                            </tr>
                            <tr>
                                <th>Município</th>
                                <td>{address?.city}</td>
                                <th>UF</th>
                                <td>{address?.state}</td>
                            </tr>
                            <tr>
                                <th colSpan={4}>Atividade</th>
                            </tr>
                            <tr>
                                <td colSpan={4}>4.03 - Hospitais, clínicas, laboratórios, sanatórios, manicômios, casas de saúde, prontos-socorros, ambulatórios e congêneres.</td>
                            </tr>
                            <tr>
                                <th colSpan={4}>Descrição</th>
                            </tr>
                            <tr>
                                <td colSpan={4}>Serviços de saúde, assistência médica e congêneres</td>
                            </tr>
                            <tr>
                                <th>Impostos</th>
                                <td>{numberToCurrency(invoices[invoiceIndex].impostos)}</td>
                                <th>Total</th>
                                <td>{numberToCurrency(invoices[invoiceIndex].valorNota)}</td>
                            </tr>
                        </tbody>
                    </Table>}
                </ModalBody>

                <ModalFooter>
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

export default Invoices;
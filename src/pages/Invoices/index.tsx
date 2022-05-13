import { useEffect, useState } from "react";

import { WarningTuple } from "../../util/getHttpErrors";

import NotaFiscal from "../../services/entities/notaFiscal";
import Paciente from "../../services/entities/paciente";
import { getPatientByInvoiceIdHttp, listInvoiceByParamsHttp } from "../../services/http/invoice";
import { formatCurrency } from "../../util/formatCurrency";
import { normalizeDate } from "../../util/formatString";

import { Table } from "reactstrap";
import { Form } from "../../styles/components";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import SelectInput from "../../components/Input/select";
import InvoiceModal from "../../components/InvoiceModal";


type ModalString = "invoice" | "";

const Invoices = () => {
    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [periods] = useState<[string, string][]>([
        ["30", "Último mês"],
        ["7", "Última semana"],
        ["0", "Hoje"]
    ]);

    const [invoices, setInvoices] = useState<NotaFiscal[]>([]);
    const [invoiceIndex, setInvoiceIndex] = useState(-1);
    const [patient, setPatient] = useState<Paciente | undefined>(undefined);

    useEffect(() => {
        getInvoices(undefined);
        // eslint-disable-next-line
    }, []);

    const getInvoices = (period: number | undefined) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listInvoiceByParamsHttp({
            dias: period
        }).then(response => {
            setInvoices([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhuma nota fiscal foi encontrada."]);

            setIsLoading("");
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        setModal(typeof(modalName) === "string" ? modalName : "");
    }

    const handlerChangePeriod = (optionValue: string) => {
        let period = Number(optionValue);
        getInvoices(period);
    }

    const onClickOpenInvoice = (index: number) => {
        getPatientByInvoiceIdHttp(invoices[index].idNotaFiscal).then(response => {
            setPatient(response);
            setInvoiceIndex(index);
            toggleModal("invoice");
        });
    }

    return (
        <>
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

                {modal === "" && <Warning value={warning} />}
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            <Table
                hover
                responsive
                striped
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
                                {new Date(normalizeDate(x.dataEmissao)).toLocaleDateString()}
                            </td>
                            <td>
                                {formatCurrency(x.valorNota)}
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

            <InvoiceModal
                showModal={modal === "invoice"}
                toggleModal={toggleModal}
                invoice={invoices[invoiceIndex]}
                patient={patient}
            />
        </>
    );
}

export default Invoices;
import { useEffect, useState } from "react";

import NotaFiscal from "../../services/entities/notaFiscal";
import Paciente from "../../services/entities/paciente";
import { formatCurrency } from "../../util/formatCurrency";
import { AddressData, splitAddress } from "../../util/formatAddress";
import { formatCnpj, formatCpf, normalizeDate } from "../../util/formatString";

import { ModalBody, ModalHeader, Table } from "reactstrap";
import { DataModal } from "../../styles/components";

type InvoiceModalProps = {
    showModal: boolean
    invoice: NotaFiscal | undefined;
    patient: Paciente | undefined;
    toggleModal: () => void;
}

const InvoiceModal = ({showModal, invoice, patient, toggleModal}: InvoiceModalProps) => {
    const [clinicAddress, setClinicAddress] = useState<AddressData | undefined>(undefined);
    const [patientAddress, setPatientAddress] = useState<AddressData | undefined>(undefined);

    useEffect(() => {
        if (invoice) {
            let address = splitAddress(invoice.clinica.endereco);
            setClinicAddress(address);
        }
    }, [invoice]);

    useEffect(() => {
        if (patient) {
            let address = splitAddress(patient.endereco);
            setPatientAddress(address);
        }
    }, [patient]);

    return (
        <DataModal
            isOpen={showModal}
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
                <Table
                    bordered
                    responsive
                >
                    {invoice && patient && clinicAddress && patientAddress && <tbody>
                        <tr>
                            <th colSpan={4}>Nota fiscal de serviço prestado</th>
                        </tr>
                        <tr>
                            <th>Número</th>
                            <td>{invoice.idNotaFiscal}</td>
                            <th>Data</th>
                            <td>{new Date(normalizeDate(invoice.dataEmissao)).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th colSpan={4}>Prestador</th>
                        </tr>
                        <tr>
                            <th>Nome</th>
                            <td colSpan={3}>{invoice.clinica.nome}</td>
                        </tr>
                        <tr>
                            <th>CNPJ</th>
                            <td>{formatCnpj(invoice.clinica.cnpj)}</td>
                            <th>Inscrição Municipal</th>
                            <td>{invoice.clinica.inscricaoMunicipal}</td>
                        </tr>
                        <tr>
                            <th>Endereço</th>
                            <td colSpan={3}>{clinicAddress.street}, {clinicAddress.number} - {clinicAddress.district} - {clinicAddress.cep}</td>
                        </tr>
                        <tr>
                            <th>Município</th>
                            <td>{clinicAddress.city}</td>
                            <th>UF</th>
                            <td>{clinicAddress.state}</td>
                        </tr>
                        <tr>
                            <th colSpan={4}>Tomador</th>
                        </tr>
                        <tr>
                            <th>Nome</th>
                            <td colSpan={3}>{patient.nome}</td>
                        </tr>
                        <tr>
                            <th>CPF</th>
                            <td>{formatCpf(patient.cpf)}</td>
                            <th>Inscrição Municipal</th>
                            <td>-</td>
                        </tr>
                        <tr>
                            <th>Endereço</th>
                            <td colSpan={3}>{patientAddress.street}, {patientAddress.number} - {patientAddress.district} - {patientAddress.cep}</td>
                        </tr>
                        <tr>
                            <th>Município</th>
                            <td>{patientAddress.city}</td>
                            <th>UF</th>
                            <td>{patientAddress.state}</td>
                        </tr>
                        <tr>
                            <th colSpan={4}>Atividade</th>
                        </tr>
                        <tr>
                            <td colSpan={4}>{invoice.clinica.atividade}</td>
                        </tr>
                        <tr>
                            <th colSpan={4}>Descrição</th>
                        </tr>
                        <tr>
                            <td colSpan={4}>{invoice.descricao}</td>
                        </tr>
                        <tr>
                            <th>Impostos</th>
                            <td>{formatCurrency(invoice.impostos)}</td>
                            <th>Total</th>
                            <td>{formatCurrency(invoice.valorNota)}</td>
                        </tr>
                    </tbody>}
                </Table>
            </ModalBody>
        </DataModal>
    );
}

export default InvoiceModal;
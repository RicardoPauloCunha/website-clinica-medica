import NotaFiscal from "../entities/notaFiscal";
import Paciente from "../entities/paciente";
import { getEnumInvoiceType } from "../enums/invoiceType";

export const _listInvoice: NotaFiscal[] = [
    {
        numeroNota: 1,
        valor: 110.00,
        dataEmissao: "24/04/2022",
        impostos: 0.00,
        tipoNota: getEnumInvoiceType("payment") 
    },
    {
        numeroNota: 2,
        valor: 120.00,
        dataEmissao: "24/04/2022",
        impostos: 0.00,
        tipoNota: getEnumInvoiceType("payment") 
    },
    {
        numeroNota: 3,
        valor: 120.00,
        dataEmissao: "24/04/2022",
        impostos: 0.00,
        tipoNota: getEnumInvoiceType("refund") 
    }
];

type listInvoiceByParamsRequest = {
    periodo?: number;
}

export const listInvoiceByParamsHttp = async (paramsData: listInvoiceByParamsRequest): Promise<NotaFiscal[]> => {
    let list: NotaFiscal[] = _listInvoice;
    
    // TODO - filtro por periodo
    paramsData;
    
    return list;
}

export const getInvoiceBySchedulingIdHttp = async (schedulingId: number): Promise<NotaFiscal[]> => {
    return _listInvoice.filter(x => x.pagamento?.agendamento?.idAgendamento === schedulingId);
}

export const getPatientByInvoiceNumberHttp = async (invoiceNumber: number): Promise<Paciente | undefined> => {
    return _listInvoice.find(x => x.numeroNota === invoiceNumber)?.pagamento?.agendamento?.paciente;
}
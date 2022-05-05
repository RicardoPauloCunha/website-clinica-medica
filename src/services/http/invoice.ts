import NotaFiscal from "../entities/notaFiscal";
import Paciente from "../entities/paciente";
import InvoiceTypeEnum from "../enums/invoiceType";

export const _listInvoice: NotaFiscal[] = [
    {
        idNotaFiscal: 1,
        valorNota: 110.00,
        dataEmissao: "2022-05-03",
        impostos: 0.00,
        tipoNotaFiscal: InvoiceTypeEnum.Payment 
    },
    {
        idNotaFiscal: 2,
        valorNota: 120.00,
        dataEmissao: "2022-05-03",
        impostos: 0.00,
        tipoNotaFiscal: InvoiceTypeEnum.Payment
    },
    {
        idNotaFiscal: 3,
        valorNota: 120.00,
        dataEmissao: "2022-05-03",
        impostos: 0.00,
        tipoNotaFiscal: InvoiceTypeEnum.Refund
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

export const getPatientByInvoiceNumberHttp = async (invoiceId: number): Promise<Paciente | undefined> => {
    return _listInvoice.find(x => x.idNotaFiscal === invoiceId)?.pagamento?.agendamento?.paciente;
}
import NotaFiscal from "../entities/notaFiscal";
import InvoiceTypeEnum from "../enums/invoiceType";
import { _listPayment } from "./payment";

export const _listInvoice: NotaFiscal[] = [
    {
        idNotaFiscal: 1,
        valorNota: 110,
        dataEmissao: "2022-05-03",
        impostos: 0.00,
        tipoNotaFiscal: InvoiceTypeEnum.Refund,
        pagamento: _listPayment[0]
    },
    {
        idNotaFiscal: 2,
        valorNota: 120,
        dataEmissao: "2022-05-03",
        impostos: 0,
        tipoNotaFiscal: InvoiceTypeEnum.Payment,
        pagamento: _listPayment[1]
    },
    {
        idNotaFiscal: 3,
        valorNota: 120,
        dataEmissao: "2022-05-03",
        impostos: 0,
        tipoNotaFiscal: InvoiceTypeEnum.Payment,
        pagamento: _listPayment[0]
    }
];

type listInvoiceByParamsRequest = {
    periodo?: number;
}

export const listInvoiceByParamsHttp = async (paramsData: listInvoiceByParamsRequest): Promise<NotaFiscal[]> => {
    return _listInvoice;
}

export const getInvoiceBySchedulingIdHttp = async (schedulingId: number): Promise<NotaFiscal[]> => {
    return _listInvoice;
}
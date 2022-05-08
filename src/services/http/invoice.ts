import { get } from "../api";
import NotaFiscal from "../entities/notaFiscal";

import { _listClinic } from "./clinic";

const ROOT = "notasfiscais/";

export const _listInvoice: NotaFiscal[] = [
    {
        idNotaFiscal: 1,
        clinica: _listClinic[0],
        valorNota: 110,
        dataEmissao: "2022-05-03",
        impostos: 0,
        descricao: "Serviços de saúde, assistência médica e congêneres"
    },
    {
        idNotaFiscal: 2,
        clinica: _listClinic[0],
        valorNota: 120,
        dataEmissao: "2022-05-03",
        impostos: 0,
        descricao: "Serviços de saúde, assistência médica e congêneres"
    },
    {
        idNotaFiscal: 2,
        clinica: _listClinic[0],
        valorNota: 100,
        dataEmissao: "2022-05-03",
        impostos: 0,
        descricao: "Reembolso"
    }
];

interface listInvoiceByParamsRequest {
    periodo?: number;
}

export const listInvoiceByParamsHttp = async (paramsData: listInvoiceByParamsRequest): Promise<NotaFiscal[]> => {
    // TODO: integração API
    let { data } = await get<NotaFiscal[]>(ROOT);
    return data;
}
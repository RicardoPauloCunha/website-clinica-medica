import { get, getParams } from "../api";
import NotaFiscal from "../entities/notaFiscal";
import Paciente from "../entities/paciente";

const ROOT = "notasfiscais/";

interface ListInvoiceByParams {
    dias: number | undefined;
}

export const listInvoiceByParamsHttp = async (paramsData: ListInvoiceByParams): Promise<NotaFiscal[]> => {
    let { data } = await getParams<ListInvoiceByParams, NotaFiscal[]>(ROOT + "listar-por-periodo", paramsData);
    return data;
}

export const getPatientByInvoiceIdHttp = async (invoiceId: number): Promise<Paciente> => {
    let { data } = await get<Paciente>(ROOT + "buscar-paciente-por-nota-fiscal/" + invoiceId);
    return data;
}
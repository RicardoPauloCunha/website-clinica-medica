import Pagamento from "./pagamento";

type NotaFiscal = {
    numeroNota: number;
    valor: number;
    dataEmissao: string;
    impostos: number;
    tipoNotaFiscal: number;
    pagamento?: Pagamento;
}

export default NotaFiscal;
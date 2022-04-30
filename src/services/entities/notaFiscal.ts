import Pagamento from "./pagamento";

interface NotaFiscal {
    idNotaFiscal: number;
    valorNota: number;
    dataEmissao: string;
    impostos: number;
    tipoNotaFiscal: number;
    pagamento?: Pagamento;
}

export default NotaFiscal;
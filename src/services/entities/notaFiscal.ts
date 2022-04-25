import Pagamento from "./pagamento";

type NotaFiscal = {
    numeroNota: number;
    valor: number;
    dataEmissao: string;
    impostos: number;
    tipoNota: number;
    pagamento?: Pagamento;
}

export default NotaFiscal;
import Clinica from "./Clinica";

interface NotaFiscal {
    idNotaFiscal: number;
    clinica: Clinica;
    valorNota: number;
    dataEmissao: string;
    impostos: number;
    descricao: string;
}

export default NotaFiscal;
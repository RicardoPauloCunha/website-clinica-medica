import NotaFiscal from "./notaFiscal";
import Pagamento from "./pagamento";

interface Ressarcimento {
    idRessarcimento: number;
    pagamento?: Pagamento;
    notaFiscal?: NotaFiscal
    data: string;
    valor: number;
    status: number;
    formaDeRessarcimento: number;
    motivoRessarcimento: string;
}

export default Ressarcimento;
import Pagamento from "./pagamento";

interface Ressarcimento {
    idRessarcimento: number;
    data: string;
    valor: number;
    motivoRessarcimento: string;
    formaDeRessarcimento: number;
    pagamento?: Pagamento;
}

export default Ressarcimento;
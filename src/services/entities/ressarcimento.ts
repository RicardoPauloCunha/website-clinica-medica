import Pagamento from "./pagamento";

type Ressarcimento = {
    idRessarcimento: number;
    data: string;
    valor: number;
    motivoRessarcimento: string;
    formaDeRessarcimento: number;
    pagamento?: Pagamento;
}

export default Ressarcimento;
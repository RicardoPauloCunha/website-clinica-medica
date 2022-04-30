import { get, post } from "../api";
import Fabricante from "../entities/fabricante";

const ROOT = "fabricantes/";

export const _listManufacturer: Fabricante[] = [
    {
        cnpj: "74.101.016/0001-27",
        nomeFabricante: "Gabriel e Emanuel Produtos Hospitalares ME",
        enderecoFabricante: "Rua José Alves de Miranda, 975, Parque Imperial - Jacareí/SP - 12329-025",
        contatoFabricante: "(12) 2815-6315"
    },
    {
        cnpj: "73.004.626/0001-40",
        nomeFabricante: "Filipe e Priscila Produtos Hospitalares ME",
        enderecoFabricante: "Rua Xingu, 730, Vila Almeida - Indaiatuba/SP - 13330-675",
        contatoFabricante: "(19) 3876-5009"
    }
];

export const listManufacturerHttp = async (): Promise<Fabricante[]> => {
    let { data } = await get<Fabricante[]>(ROOT);
    return data;
}

interface postManufacturerRequest {
    cnpj: string;
    nomeFabricante: string;
    enderecoFabricante: string;
    contatoFabricante: string;
}

export const postManufacturerHttp = async (requestData: postManufacturerRequest): Promise<Fabricante> => {
    let { data } = await post<postManufacturerRequest, Fabricante>(ROOT, requestData);
    return data;
}
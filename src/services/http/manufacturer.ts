import { get, post } from "../api";
import Fabricante from "../entities/fabricante";

const ROOT = "fabricantes/";

export const _listManufacturer: Fabricante[] = [
    {
        cnpj: "74101016000127",
        nomeFabricante: "Gabriel e Emanuel Produtos Hospitalares ME",
        enderecoFabricante: "Rua José Alves de Miranda, 975, Parque Imperial - Jacareí/SP - 12329-025",
        contatoFabricante: "1228156315"
    },
    {
        cnpj: "73004626000140",
        nomeFabricante: "Filipe e Priscila Produtos Hospitalares ME",
        enderecoFabricante: "Rua Xingu, 730, Vila Almeida - Indaiatuba/SP - 13330-675",
        contatoFabricante: "1938765009"
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
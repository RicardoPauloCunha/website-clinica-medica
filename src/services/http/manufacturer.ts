import { get, post, put } from "../api";
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

interface PostManufacturerRequest {
    cnpj: string;
    nomeFabricante: string;
    enderecoFabricante: string;
    contatoFabricante: string;
}

export const postManufacturerHttp = async (requestData: PostManufacturerRequest): Promise<Fabricante> => {
    let { data } = await post<PostManufacturerRequest, Fabricante>(ROOT, requestData);
    return data;
}

interface PutManufacturerRequest extends PostManufacturerRequest {

}

export const putManufacturerHttp = async (requestData: PutManufacturerRequest): Promise<void> => {
    await put<PutManufacturerRequest, Fabricante>(ROOT + requestData.cnpj, requestData);
}
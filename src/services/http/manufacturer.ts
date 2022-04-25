import Fabricante from "../entities/fabricante";

export const _listManufacturer: Fabricante[] = [
    {
        cnpj: "74.101.016/0001-27",
        nome: "Gabriel e Emanuel Produtos Hospitalares ME",
        endereco: "Rua José Alves de Miranda, 975, Parque Imperial - Jacareí/SP - 12329-025",
        contato: "(12) 2815-6315"
    },
    {
        cnpj: "73.004.626/0001-40",
        nome: "Filipe e Priscila Produtos Hospitalares ME",
        endereco: "Rua Xingu, 730, Vila Almeida - Indaiatuba/SP - 13330-675",
        contato: "(19) 3876-5009"
    }
];

export const listManufacturerHttp = async (): Promise<Fabricante[]> => {
    return _listManufacturer;
}
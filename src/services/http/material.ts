import Material from "../entities/material";
import { getEnumMaterialStatus } from "../enums/materialStatus";

export const _listMaterial: Material[] = [
    {
        idMaterial: 1,
        nome: "Estetoscópio",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da",
        unidadeDeMedida: "Unidade",
        quantidade: 80,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 2,
        nome: "Eletrocardiógrafo",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde",
        unidadeDeMedida: "Unidade",
        quantidade: 60,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 3,
        nome: "Cadeira de roda",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma",
        unidadeDeMedida: "Unidade",
        quantidade: 50,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 4,
        nome: "Colchão de pressão",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos",
        unidadeDeMedida: "Unidade",
        quantidade: 20,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 5,
        nome: "Bomba de infusão",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, com",
        unidadeDeMedida: "Unidade",
        quantidade: 10,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 6,
        nome: "Laser médico",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o",
        unidadeDeMedida: "Unidade",
        quantidade: 200,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 7,
        nome: "Seringa",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver",
        unidadeDeMedida: "Unidade",
        quantidade: 100,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 8,
        nome: "Bandagem",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é",
        unidadeDeMedida: "Unidade",
        quantidade: 150,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 9,
        nome: "Marcapasso cardíaco",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de",
        unidadeDeMedida: "Unidade",
        quantidade: 130,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 10,
        nome: "Desfibrilador cardioversor implantável",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de 'Conteúdo aqui, conteúdo aqui', fazendo com que ele tenha",
        unidadeDeMedida: "Unidade",
        quantidade: 140,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 11,
        nome: "Suprimento para coleta de sangue",
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente",
        unidadeDeMedida: "Unidade",
        quantidade: 10,
        status: getEnumMaterialStatus("able")
    },
    {
        idMaterial: 12,
        nome: "Analisador de urinálise e eletrólito",
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem",
        unidadeDeMedida: "Unidade",
        quantidade: 21,
        status: getEnumMaterialStatus("able")
    }
];

export const getMaterialByIdHttp = async (id: number): Promise<Material | undefined> => {
    return _listMaterial.find(x => x.idMaterial === id);
}

export const listMaterialByCategoryHttp = async (materialCategoryId: number): Promise<Material[] | undefined> => {
    if (materialCategoryId === 0)
        return _listMaterial;
    else
        return _listMaterial.filter(x => x.categoriaMaterial?.idCategoriaMaterial === materialCategoryId);
}

export const postMaterialHttp = async (requestData: Material): Promise<void> => {
    requestData;
}

export const putMaterialHttp = async (requestData: Material): Promise<void> => {
    requestData;
}
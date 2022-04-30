import { get, getParams, post, put } from "../api";
import Material from "../entities/material";
import { getEnumMaterialStatus } from "../enums/materialStatus";
import { _listManufacturer } from "./manufacturer";
import { _listCategory } from "./category";

const ROOT = "materiais/";

export const _listMaterial: Material[] = [
    {
        idMaterial: 1,
        nomeMaterial: "Estetoscópio",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da",
        unidadeDeMedida: "Unidade",
        quantidade: 101,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[0],
        fabricante: _listManufacturer[0]
    },
    {
        idMaterial: 2,
        nomeMaterial: "Eletrocardiógrafo",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde",
        unidadeDeMedida: "Unidade",
        quantidade: 60,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[0],
        fabricante: _listManufacturer[0]
    },
    {
        idMaterial: 3,
        nomeMaterial: "Cadeira de roda",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma",
        unidadeDeMedida: "Unidade",
        quantidade: 50,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[1],
        fabricante: _listManufacturer[0]
    },
    {
        idMaterial: 4,
        nomeMaterial: "Colchão de pressão",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos",
        unidadeDeMedida: "Unidade",
        quantidade: 20,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[1],
        fabricante: _listManufacturer[0]
    },
    {
        idMaterial: 5,
        nomeMaterial: "Bomba de infusão",
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, com",
        unidadeDeMedida: "Unidade",
        quantidade: 10,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[2],
        fabricante: _listManufacturer[0]
    },
    {
        idMaterial: 6,
        nomeMaterial: "Laser médico",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o",
        unidadeDeMedida: "Unidade",
        quantidade: 200,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[2],
        fabricante: _listManufacturer[0]
    },
    {
        idMaterial: 7,
        nomeMaterial: "Seringa",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver",
        unidadeDeMedida: "Unidade",
        quantidade: 100,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[3],
        fabricante: _listManufacturer[1]
    },
    {
        idMaterial: 8,
        nomeMaterial: "Bandagem",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é",
        unidadeDeMedida: "Unidade",
        quantidade: 150,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[3],
        fabricante: _listManufacturer[1]
    },
    {
        idMaterial: 9,
        nomeMaterial: "Marcapasso cardíaco",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de",
        unidadeDeMedida: "Unidade",
        quantidade: 130,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[4],
        fabricante: _listManufacturer[1]
    },
    {
        idMaterial: 10,
        nomeMaterial: "Desfibrilador cardioversor implantável",
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de 'Conteúdo aqui, conteúdo aqui', fazendo com que ele tenha",
        unidadeDeMedida: "Unidade",
        quantidade: 140,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[4],
        fabricante: _listManufacturer[1]
    },
    {
        idMaterial: 11,
        nomeMaterial: "Suprimento para coleta de sangue",
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente",
        unidadeDeMedida: "Unidade",
        quantidade: 10,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[5],
        fabricante: _listManufacturer[1]
    },
    {
        idMaterial: 12,
        nomeMaterial: "Analisador de urinálise e eletrólito",
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem",
        unidadeDeMedida: "Unidade",
        quantidade: 0,
        statusMaterial: getEnumMaterialStatus("enabled"),
        categoriaMaterial: _listCategory[6],
        fabricante: _listManufacturer[1]
    }
];

export const getMaterialByIdHttp = async (materialId: number): Promise<Material> => {
    let { data } = await get<Material>(ROOT + materialId);
    return data;
}

interface FilterMaterialParams {
    idCategoria: number | null;
}

export const listMaterialByCategoryHttp = async (paramsData: FilterMaterialParams): Promise<Material[]> => {
    let { data } = await getParams<FilterMaterialParams, Material[]>(ROOT + "idcategoria", paramsData);
    return data;
}

interface PostMaterialRequest {
    nomeMaterial: string;
    unidadeDeMedida: string;
    quantidade: number;
    descricao: string;
    categoriaMaterial: {
        idCategoria: number;
    }
    fabricante: {
        cnpj: string;
    }
    statusMaterial: number;
}

export const postMaterialHttp = async (requestData: PostMaterialRequest): Promise<void> => {
    await post<PostMaterialRequest, void>(ROOT, requestData);
}

interface PutMaterialRequest extends PostMaterialRequest {
    idMaterial: number;
}

export const putMaterialHttp = async (requestData: PutMaterialRequest): Promise<void> => {
    await put<PutMaterialRequest, void>(ROOT + "alterarmaterial", requestData);
}
import { SuccessResponse } from "../defaultEntities";
import { EntradaSaidaMaterial } from "../entities/entradaSaidaMaterial";
import { getEnumMaterialInputOutputType } from "../enums/materialInputOutputType";
import { _listMaterial } from "./material";

export const _listMaterialInputOutput: EntradaSaidaMaterial[] = [
    {
        idEntradaSaidaMateria: 1,
        data: new Date().toLocaleString() + '',
        quantidade: 80,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[0]
    },
    {
        idEntradaSaidaMateria: 2,
        data: new Date().toLocaleString() + '',
        quantidade: 60,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[1]
    },
    {
        idEntradaSaidaMateria: 3,
        data: new Date().toLocaleString() + '',
        quantidade: 50,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[2]
    },
    {
        idEntradaSaidaMateria: 4,
        data: new Date().toLocaleString() + '',
        quantidade: 20,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[3]
    },
    {
        idEntradaSaidaMateria: 5,
        data: new Date().toLocaleString() + '',
        quantidade: 10,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, com",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[4]
    },
    {
        idEntradaSaidaMateria: 6,
        data: new Date().toLocaleString() + '',
        quantidade: 200,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[5]
    },
    {
        idEntradaSaidaMateria: 7,
        data: new Date().toLocaleString() + '',
        quantidade: 100,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[6]
    },
    {
        idEntradaSaidaMateria: 8,
        data: new Date().toLocaleString() + '',
        quantidade: 150,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[7]
    },
    {
        idEntradaSaidaMateria: 9,
        data: new Date().toLocaleString() + '',
        quantidade: 130,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[8]
    },
    {
        idEntradaSaidaMateria: 10,
        data: new Date().toLocaleString() + '',
        quantidade: 140,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de 'Conteúdo aqui, conteúdo aqui', fazendo com que ele tenha",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[9]
    },
    {
        idEntradaSaidaMateria: 11,
        data: new Date().toLocaleString() + '',
        quantidade: 10,
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[10]
    },
    {
        idEntradaSaidaMateria: 12,
        data: new Date().toLocaleString() + '',
        quantidade: 21,
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input"),
        material: _listMaterial[0]
    }
];

export const listMaterialInputOutputByMaterialIdHttp = async (materialId: number): Promise<EntradaSaidaMaterial[]> => {
    return _listMaterialInputOutput.filter(x => x.material?.idMaterial === materialId);
}

export const postMaterialInputOutputHttp = async (requestData: EntradaSaidaMaterial): Promise<SuccessResponse> => {
    return { message: "" };
}

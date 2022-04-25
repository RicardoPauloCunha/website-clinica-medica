import { EntradaSaidaMaterial } from "../entities/entradaSaidaMaterial";
import { getEnumMaterialInputOutputType } from "../enums/materialInputOutputType";

export const _listMaterialInputOutput: EntradaSaidaMaterial[] = [
    {
        idEntradaSaidaMateria: 1,
        data: "24/04/2022",
        quantidade: 80,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 2,
        data: "24/04/2022",
        quantidade: 60,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 3,
        data: "24/04/2022",
        quantidade: 50,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 4,
        data: "24/04/2022",
        quantidade: 20,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 5,
        data: "24/04/2022",
        quantidade: 10,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, com",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 6,
        data: "24/04/2022",
        quantidade: 200,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 7,
        data: "24/04/2022",
        quantidade: 100,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 8,
        data: "24/04/2022",
        quantidade: 150,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 9,
        data: "24/04/2022",
        quantidade: 130,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 10,
        data: "24/04/2022",
        quantidade: 140,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de 'Conteúdo aqui, conteúdo aqui', fazendo com que ele tenha",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 11,
        data: "24/04/2022",
        quantidade: 10,
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    },
    {
        idEntradaSaidaMateria: 12,
        data: "24/04/2022",
        quantidade: 21,
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem",
        tipoEntradaSaida: getEnumMaterialInputOutputType("input")
    }
];

export const getMaterialInputOutputByMaterialIdHttp = async (materialId: number): Promise<EntradaSaidaMaterial[]> => {
    return _listMaterialInputOutput.filter(x => x.material?.idMaterial === materialId);
}

export const postMaterialInputOutputHttp = async (requestData: EntradaSaidaMaterial): Promise<void> => {
    requestData;
}

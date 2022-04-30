import { get, post } from "../api";
import EntradaSaidaMaterial from "../entities/entradaSaidaMaterial";
import { getEnumRecordType } from "../enums/recordType";
import { _listMaterial } from "./material";

const ROOT = "entradasaidamateriais/";

export const _listRecord: EntradaSaidaMaterial[] = [
    {
        idEntradaSaidaMaterial: 1,
        data: new Date().toLocaleString() + '',
        quantidade: 80,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[0]
    },
    {
        idEntradaSaidaMaterial: 2,
        data: new Date().toLocaleString() + '',
        quantidade: 60,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[1]
    },
    {
        idEntradaSaidaMaterial: 3,
        data: new Date().toLocaleString() + '',
        quantidade: 50,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[2]
    },
    {
        idEntradaSaidaMaterial: 4,
        data: new Date().toLocaleString() + '',
        quantidade: 20,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[3]
    },
    {
        idEntradaSaidaMaterial: 5,
        data: new Date().toLocaleString() + '',
        quantidade: 10,
        descricao: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, com",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[4]
    },
    {
        idEntradaSaidaMaterial: 6,
        data: new Date().toLocaleString() + '',
        quantidade: 200,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[5]
    },
    {
        idEntradaSaidaMaterial: 7,
        data: new Date().toLocaleString() + '',
        quantidade: 100,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[6]
    },
    {
        idEntradaSaidaMaterial: 8,
        data: new Date().toLocaleString() + '',
        quantidade: 150,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[7]
    },
    {
        idEntradaSaidaMaterial: 9,
        data: new Date().toLocaleString() + '',
        quantidade: 130,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[8]
    },
    {
        idEntradaSaidaMaterial: 10,
        data: new Date().toLocaleString() + '',
        quantidade: 140,
        descricao: "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação. A vantagem de usar Lorem Ipsum é que ele tem uma distribuição normal de letras, ao contrário de 'Conteúdo aqui, conteúdo aqui', fazendo com que ele tenha",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[9]
    },
    {
        idEntradaSaidaMaterial: 11,
        data: new Date().toLocaleString() + '',
        quantidade: 10,
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[10]
    },
    {
        idEntradaSaidaMaterial: 12,
        data: new Date().toLocaleString() + '',
        quantidade: 21,
        descricao: "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem",
        tipoEntradaSaida: getEnumRecordType("input"),
        material: _listMaterial[0]
    }
];

export const listRecordByMaterialIdHttp = async (materialId: number): Promise<EntradaSaidaMaterial[]> => {
    let { data } = await get<EntradaSaidaMaterial[]>(ROOT + "buscarporidmaterial/" + materialId);
    return data;
}

interface PostRecordRequest {
    quantidade: number;
    descricao: string;
    material: {
        idMaterial: number;
    },
    funcionario: {
        idFuncionario: number;
    },
    tipoEntradaSaida: number;
}

export const postRecordHttp = async (requestData: PostRecordRequest): Promise<void> => {
    await post<PostRecordRequest, void>(ROOT, requestData);
}

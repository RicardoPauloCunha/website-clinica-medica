import { get, post } from "../api";
import EntradaSaidaMaterial from "../entities/entradaSaidaMaterial";
import RecordTypeEnum from "../enums/recordType";

const ROOT = "entradasaidamateriais/";

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
    tipoEntradaSaida: RecordTypeEnum;
}

export const postRecordHttp = async (requestData: PostRecordRequest): Promise<void> => {
    await post<PostRecordRequest, void>(ROOT, requestData);
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EntradaSaidaMaterial from "../../services/entities/entradaSaidaMaterial";
import RecordTypeEnum from "../../services/enums/recordType";
import { listRecordByMaterialIdHttp } from "../../services/http/record";
import { WarningTuple } from "../../util/getHttpErrors";
import { formatQuantity, normalizeDate } from "../../util/formatString";

import { TextGroupGrid } from "../../styles/components";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";

const MaterialRecords = () => {
    const routeParams = useParams();

    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [records, setRecords] = useState<EntradaSaidaMaterial[]>([]);

    useEffect(() => {
        getRecords();
        // eslint-disable-next-line
    }, []);

    const getRecords = () => {
        setWarning(["", ""]);

        let id = Number(routeParams.materialId);
        if (isNaN(id)) {
            setWarning(["danger", "Material inválido."]);
            return;
        }

        setIsLoading("get");
        listRecordByMaterialIdHttp(id).then(response => {
            setRecords([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum registro do material foi encontrado."]);

            setIsLoading("");
        });
    }

    return (
        <>
            <h1>Registros de entrada/saída do material</h1>

            {isLoading === "get" && <SpinnerBlock />}

            <Warning value={warning} />

            {records[0] !== undefined && <DataCard
                title="Material"
            >
                <TextGroupGrid>
                    <DataText
                        label="Nome"
                        value={records[0].material?.nomeMaterial}
                    />

                    <DataText
                        label="Quantidade"
                        value={formatQuantity(records[0].material?.quantidade)}
                    />
                </TextGroupGrid>
            </DataCard>}

            {records.map(x => (
                <DataCard
                    key={x.idEntradaSaidaMaterial}
                    title={`Registro de ${x.tipoEntradaSaida === RecordTypeEnum.Input ? "entrada" : "saída"}`}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(x.data)).toLocaleDateString()}
                        />

                        <DataText
                            label="Quantidade"
                            value={`${x.tipoEntradaSaida === RecordTypeEnum.Input ? "+" : "-"} ${formatQuantity(x.quantidade)}`}
                        />

                        <DataText
                            label="Descrição"
                            value={x.descricao}
                        />
                    </TextGroupGrid>
                </DataCard>
            ))}
        </>
    );
}

export default MaterialRecords;
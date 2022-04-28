import { useEffect, useState } from "react";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import { TextGroupGrid } from "../../styles/components";
import { WarningTuple } from "../../util/getHttpErrors";
import DataCard from "../../components/DataCard";
import DataText from "../../components/DataText";
import { useParams } from "react-router-dom";
import { getValueMaterialInputOutputType } from "../../services/enums/materialInputOutputType";
import { listMaterialInputOutputByMaterialIdHttp } from "../../services/http/materialInputOutput";
import { EntradaSaidaMaterial } from "../../services/entities/entradaSaidaMaterial";

const MaterialRecords = () => {
    const routeParams = useParams();

    const INPUT_TYPE = getValueMaterialInputOutputType("input");

    const [isLoading, setIsLoading] = useState<"get" | "record" | "">("");

    const [materialRecords, setMaterialRecords] = useState<EntradaSaidaMaterial[]>([]);
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    useEffect(() => {
        getMaterialRecords();
        // eslint-disable-next-line
    }, []);

    const getMaterialRecords = () => {
        setIsLoading("get");
        setWarning(["", ""]);

        setTimeout(() => {
            let id = Number(routeParams.materialId);

            if (isNaN(id)) {
                setWarning(["danger", "Material inválido."]);
                return;
            }

            listMaterialInputOutputByMaterialIdHttp(id).then(response => {
                setMaterialRecords([...response]);

                if (response.length === 0)
                    setWarning(["warning", "Nenhum registro do material foi encontrado."]);

                setIsLoading("");
            });
        }, 1000);
    }

    return (
        <>
            <h1>Registros de entrada/saída do material</h1>

            {isLoading === "get" && <SpinnerBlock />}
            <Warning value={warning} />

            {materialRecords.map(x => (
                <DataCard
                    key={x.idEntradaSaidaMateria}
                    title={`Registro de ${getValueMaterialInputOutputType(undefined, x.tipoEntradaSaida) === INPUT_TYPE ? "entrada" : "saída"}`}
                >
                    <TextGroupGrid>
                        <DataText
                            label="Data"
                            value={x.data}
                        />

                        <DataText
                            label="Quantidade"
                            value={x.quantidade.toString()}
                        />

                        <DataText
                            label="Descrição"
                            value={x.descricao}
                            isFullRow={true}
                        />
                    </TextGroupGrid>
                </DataCard>
            ))}
        </>
    );
}

export default MaterialRecords;
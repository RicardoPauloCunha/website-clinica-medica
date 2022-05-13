import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EntradaSaidaMaterial from "../../services/entities/entradaSaidaMaterial";
import { listRecordByMaterialIdHttp } from "../../services/http/record";
import { WarningTuple } from "../../util/getHttpErrors";
import DocumentTitle from "../../util/documentTitle";

import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import MaterialRecordCard from "../../components/DataCard/materialRecord";
import MaterialCollapseCard from "../../components/CollapseCard/material";

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

    DocumentTitle("Registros material | CM");

    return (
        <>
            <h1>Registros de entrada/saída do material</h1>

            {isLoading === "get" && <SpinnerBlock />}

            <Warning value={warning} />

            {records[0] !== undefined && <MaterialCollapseCard
                key={records[0].material.idMaterial}
                id={records[0].material.idMaterial}
                name={records[0].material.nomeMaterial}
                description={records[0].material.descricao}
                unitMeasurement={records[0].material.unidadeDeMedida}
                quantity={records[0].material.quantidade}
                categoryName={records[0].material.categoriaMaterial.nomeCategoria}
                manufacturerName={records[0].material.fabricante.nomeFabricante}
            />}

            {records.map(x => (
                <MaterialRecordCard
                    key={x.idEntradaSaidaMaterial}
                    recordType={x.tipoEntradaSaida}
                    quantity={x.quantidade}
                    date={x.data}
                    description={x.descricao}
                />
            ))}
        </>
    );
}

export default MaterialRecords;
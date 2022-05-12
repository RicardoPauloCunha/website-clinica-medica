import RecordTypeEnum from "../../services/enums/recordType";
import { formatQuantity, normalizeDate } from "../../util/formatString";

import { DataCardEl } from "./styles";
import DataText from "../DataText";

type MaterialRecordCardProps = {
    recordType: number;
    quantity: number;
    date: string;
    description: string;
}

const MaterialRecordCard = ({ recordType, quantity, date, description }: MaterialRecordCardProps) => {
    return (
        <DataCardEl className="data-card-material-record">
            <DataText
                label={`Registro de ${recordType === RecordTypeEnum.Input ? "entrada" : "saída"}`}
                value={new Date(normalizeDate(date)).toLocaleDateString()}
            />

            <DataText
                label="Quantidade"
                value={`${recordType === RecordTypeEnum.Input ? "+" : "-"}${formatQuantity(quantity)}`}
            />

            <DataText
                label="Descrição"
                value={description}
            />
        </DataCardEl>
    );
}

export default MaterialRecordCard;
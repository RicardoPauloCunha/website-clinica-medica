
import { normalizeDate } from "../../util/formatString";

import { DataCardEl } from "./styles";
import DataText from "../DataText";

type AttendanceCardProps = {
    id: number;
    date: string;
    serviceName: string;
    doctorName: string;
    comments: string;
    diagnosis: string;
}

const AttendanceCard = ({ id, date, serviceName, doctorName, comments, diagnosis }: AttendanceCardProps) => {
    return (
        <DataCardEl className="data-card-attendance">
            <DataText
                label={serviceName}
                value={new Date(normalizeDate(date)).toLocaleDateString()}
            />

            <DataText
                label="Serviço"
                value={serviceName}
            />

            <DataText
                label="Médico"
                value={doctorName}
            />

            <DataText
                label="Observações"
                value={comments}
            />

            <DataText
                label="Diagnóstico"
                value={diagnosis}
            />
        </DataCardEl>
    );
}

export default AttendanceCard;
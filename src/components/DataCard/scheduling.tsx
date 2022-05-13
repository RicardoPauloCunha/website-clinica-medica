import ScheduleStatusEnum, { defineColorScheduleStatus, getValueScheduleStatus } from "../../services/enums/scheduleStatus";

import { Button } from "reactstrap";
import { DataCardEl } from "./styles";
import DataText from "../DataText";
import StatusBadge from "../StatusBadge";

type SchedulingCardProps = {
    id: number;
    patientName: string;
    time: string;
    date: string;
    status: ScheduleStatusEnum;
    serviceName: string;
    doctorName?: string;
    onClickOpenSchedule: (scheduleId: number) => void;
}

const SchedulingCard = ({ id, patientName, time, date, status, serviceName, doctorName, onClickOpenSchedule }: SchedulingCardProps) => {
    return (
        <DataCardEl className={doctorName ? "data-card-scheduling" : "data-card-scheduling-doctor"}>
            <DataText
                label={patientName}
                value={new Date(date + "T" + time).toLocaleString()}
            />

            <StatusBadge
                label="Status"
                status={status}
                value={getValueScheduleStatus(status)}
                defineColor={defineColorScheduleStatus}
            />

            <DataText
                label="Serviço"
                value={serviceName}
            />

            {doctorName && <DataText
                label="Médico"
                value={doctorName}
            />}

            <Button
                color="info"
                onClick={() => onClickOpenSchedule(id)}
            >
                Abrir
            </Button>
        </DataCardEl>
    );
}

export default SchedulingCard;
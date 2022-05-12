import { defineColorScheduleStatus, getValueScheduleStatus } from "../../services/enums/scheduleStatus";
import { formatCellphone, formatCpf, normalizeDate } from "../../util/formatString";

import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";
import StatusBadge from "../StatusBadge";

type SchedulingCollapseCardProps = {
    id: number;
    patientName: string;
    patientCpf: string;
    patientContact: string;
    time: string;
    date: string;
    creationDate: string;
    status: number;
    serviceName: string;
    doctorName: string;
    specialtyName: string;
}

const SchedulingCollapseCard = ({ id, patientName, patientCpf, patientContact, time, date, creationDate, status, serviceName, doctorName, specialtyName }: SchedulingCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-scheduling">
                <AccordionHeader targetId={id.toString()}>
                    {`${patientName} - ${new Date(date + "T" + time).toLocaleString()}`}
                </AccordionHeader>

                <AccordionBody accordionId={id.toString()}>
                    <DataText
                        label="CPF"
                        value={formatCpf(patientCpf)}
                    />

                    <DataText
                        label="Contato"
                        value={formatCellphone(patientContact)}
                    />

                    <DataText
                        label="Data"
                        value={new Date(normalizeDate(creationDate)).toLocaleDateString()}
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
                        isFullRow={true}
                    />

                    <DataText
                        label="Médico"
                        value={doctorName}
                    />

                    <DataText
                        label="Especialidade"
                        value={specialtyName}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default SchedulingCollapseCard;
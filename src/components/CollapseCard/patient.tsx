import { formatCellphone, formatCpf } from "../../util/formatString";

import { AccordionBody, AccordionHeader, Button, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type PatientCollapseCardProps = {
    cpf: string;
    name: string;
    contact: string;
    address: string;
    onClickOpenPatient?: (editPatient: boolean) => void;
}

const PatientCollapseCard = ({ cpf, name, contact, address, onClickOpenPatient }: PatientCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-patient collapse-card-color-gray">
                <AccordionHeader targetId={cpf}>
                    {`${name} - ${formatCpf(cpf)}`}
                </AccordionHeader>

                <AccordionBody accordionId={cpf}>
                    <DataText
                        label="Contato"
                        value={formatCellphone(contact)}
                    />

                    <DataText
                        label="Endereço"
                        value={address}
                    />

                    {onClickOpenPatient !== undefined && <Button
                        color="warning"
                        onClick={() => onClickOpenPatient(true)}
                    >
                        Editar
                    </Button>}
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default PatientCollapseCard;
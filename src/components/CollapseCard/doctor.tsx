import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type DoctorCollapseCardProps = {
    id: number;
    name: string;
    email: string;
    specialtyName: string;
}

const DoctorCollapseCard = ({ id, name, email, specialtyName }: DoctorCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-doctor">
                <AccordionHeader targetId={id.toString()}>
                    {`${name} - ${specialtyName}`}
                </AccordionHeader>

                <AccordionBody accordionId={id.toString()}>
                    <DataText
                        label="Email"
                        value={email}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default DoctorCollapseCard;
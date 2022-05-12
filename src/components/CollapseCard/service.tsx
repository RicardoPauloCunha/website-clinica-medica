import { formatCurrency } from "../../util/formatCurrency";

import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type ServiceCollapseCardProps = {
    id: number;
    name: string;
    price: number;
    description: string;
}

const ServiceCollapseCard = ({ id, name, price, description }: ServiceCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-service">
                <AccordionHeader targetId={id.toString()}>
                    {`${name} - ${formatCurrency(price)}`}
                </AccordionHeader>

                <AccordionBody accordionId={id.toString()}>
                    <DataText
                        label="Descrição"
                        value={description}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default ServiceCollapseCard;
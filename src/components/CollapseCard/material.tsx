import { formatQuantity } from "../../util/formatString";

import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type MaterialCollapseCardProps = {
    id: number;
    name: string;
    description: string;
    unitMeasurement: string;
    quantity: number;
    categoryName: string;
    manufacturerName: string;
}

const MaterialCollapseCard = ({ id, name, description, unitMeasurement, quantity, categoryName, manufacturerName }: MaterialCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-material collapse-card-color-gray">
                <AccordionHeader targetId={id.toString()}>
                    {`${name} - ${formatQuantity(quantity)}`}
                </AccordionHeader>

                <AccordionBody accordionId={id.toString()}>
                    <DataText
                        label="Unidade de medida"
                        value={unitMeasurement}
                    />

                    <DataText
                        label="Categoria"
                        value={categoryName}
                    />

                    <DataText
                        label="Fabricante"
                        value={manufacturerName}
                    />

                    <DataText
                        label="Descrição"
                        value={description}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default MaterialCollapseCard;
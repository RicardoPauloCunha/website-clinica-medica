import { formatCnpj, formatTelephone } from "../../util/formatString";

import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type ManufacturerCollapseCardProps = {
    cnpj: string;
    name: string;
    contact: string;
    address: string;
}

const ManufacturerCollapseCard = ({ cnpj, name, contact, address }: ManufacturerCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-manufacturer">
                <AccordionHeader targetId={cnpj}>
                    {`${name} - ${formatCnpj(cnpj)}`}
                </AccordionHeader>

                <AccordionBody accordionId={cnpj}>
                    <DataText
                        label="Contato"
                        value={formatTelephone(contact)}
                    />

                    <DataText
                        label="Endereço"
                        value={address}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default ManufacturerCollapseCard;
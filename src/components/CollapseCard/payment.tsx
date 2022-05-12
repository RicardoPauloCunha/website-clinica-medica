import { getValuePaymentMethodType } from "../../services/enums/paymentMethodType";
import { formatCurrency } from "../../util/formatCurrency";
import { normalizeDate } from "../../util/formatString";

import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type PaymentCollapseCardProps = {
    id: number;
    price: number;
    discount: number;
    paymentMethodType: number;
    date: string;
}

const PaymentCollapseCard = ({ id, price, discount, paymentMethodType, date }: PaymentCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className="collapse-card-payment">
                <AccordionHeader targetId={id.toString()}>
                    {`${formatCurrency(price)} - ${new Date(normalizeDate(date)).toLocaleDateString()}`}
                </AccordionHeader>

                <AccordionBody accordionId={id.toString()}>
                    <DataText
                        label="Desconto"
                        value={formatCurrency(discount)}
                    />

                    <DataText
                        label="Forma de pagamento"
                        value={getValuePaymentMethodType(paymentMethodType)}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default PaymentCollapseCard;
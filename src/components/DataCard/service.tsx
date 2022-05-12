import { useNavigate } from "react-router-dom";

import { formatCurrency } from "../../util/formatCurrency";

import { Button } from "reactstrap";
import { DataCardEl } from "./styles";
import DataText from "../DataText";

type ServiceCardProps = {
    id: number;
    name: string;
    price: number;
    description: string;
    specialtyName: string;
}

const ServiceCard = ({ id, name, price, description, specialtyName }: ServiceCardProps) => {
    const navigate = useNavigate();

    const onClickEditData = () => {
        navigate("/servicos/" + id + "/editar");
    }

    return (
        <DataCardEl className="data-card-service">
            <DataText
                label={name}
                value={formatCurrency(price)}
            />

            <DataText
                label="Especialidade"
                value={specialtyName}
            />

            <DataText
                label="Descrição"
                value={description}
            />

            <Button
                color="warning"
                onClick={() => onClickEditData()}
            >
                Editar
            </Button>
        </DataCardEl>
    );
}

export default ServiceCard;
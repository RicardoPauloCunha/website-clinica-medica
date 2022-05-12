import { useNavigate } from "react-router-dom";

import { formatQuantity } from "../../util/formatString";

import { Button } from "reactstrap";
import { DataCardEl } from "./styles";
import DataText from "../DataText";

type MaterialCardProps = {
    id: number;
    name: string;
    description: string;
    unitMeasurement: string;
    quantity: number;
    categoryName: string;
    manufacturerName: string;
    onClickAddRecord: (materialId: number) => void
}

const MaterialCard = ({ id, name, description, unitMeasurement, quantity, categoryName, manufacturerName, onClickAddRecord }: MaterialCardProps) => {
    const navigate = useNavigate();

    const onClickEditData = () => {
        navigate("/materiais/" + id + "/editar");
    }

    return (
        <DataCardEl className="data-card-material">
            <DataText
                label={name}
                value={`${formatQuantity(quantity)} (${unitMeasurement})`}
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

            <div>
                <Button
                    color="warning"
                    onClick={() => onClickEditData()}
                >
                    Editar
                </Button>

                <Button
                    color="secondary"
                    onClick={() => onClickAddRecord(id)}
                >
                    Entrada/Saída
                </Button>
            </div>
        </DataCardEl>
    );
}

export default MaterialCard;
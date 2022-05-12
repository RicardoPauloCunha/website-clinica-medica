import { useNavigate } from "react-router-dom";

import EmployeeStatusEnum, { defineColorEmployeeStatus, getValueEmployeeStatus } from "../../services/enums/employeeStatus";
import EmployeeTypeEnum, { getValueEmployeeType } from "../../services/enums/employeeType";

import { Button } from "reactstrap";
import { DataCardEl } from "./styles";
import DataText from "../DataText";
import StatusBadge from "../StatusBadge";

type EmployeeCardProps = {
    id: number;
    name: string;
    email: string;
    sector: string;
    employeeType: EmployeeTypeEnum;
    employeeStatus: EmployeeStatusEnum;
}

const EmployeeCard = ({ id, name, email, sector, employeeType, employeeStatus }: EmployeeCardProps) => {
    const navigate = useNavigate();

    const onClickEditData = () => {
        if (employeeType === EmployeeTypeEnum.Doctor)
            navigate("/funcionarios/medicos/" + id + "/editar");
        else
            navigate("/funcionarios/" + id + "/editar");
    }

    return (
        <DataCardEl className="data-card-employee" >
            <DataText
                label={name}
                value={email}
            />

            <DataText
                label="Tipo funcionário/Setor"
                value={`${getValueEmployeeType(employeeType)}/${sector}`}
            />

            <StatusBadge
                label="Status"
                status={employeeStatus}
                value={getValueEmployeeStatus(employeeStatus)}
                defineColor={defineColorEmployeeStatus}
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

export default EmployeeCard;
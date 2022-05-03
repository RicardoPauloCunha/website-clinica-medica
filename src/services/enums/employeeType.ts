type EmployeeType = "admin" | "receptionist" | "stockist" | "doctor";

export const getValueEmployeeType = (typeString?: EmployeeType, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumEmployeeType(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Administrador";
        case 2:
            return "Recepcionista";
        case 3:
            return "Estoquista";
        case 4:
            return "Médico";
        default:
            return "";
    }
}

export const getEnumEmployeeType = (type: EmployeeType) => {
    switch (type) {
        case "admin":
            return 1;
        case "receptionist":
            return 2;
        case "stockist":
            return 3;
        case "doctor":
            return 4;
        default:
            return 0;
    }
}

export const listEmployeeType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 3; i++)
        list.push(getValueEmployeeType(undefined, i));

    return list;
}

export const listAllEmployeeType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 4; i++)
        list.push(getValueEmployeeType(undefined, i));

    return list;
}

export default EmployeeType;
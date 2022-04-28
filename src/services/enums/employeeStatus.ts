type EmployeeStatus = "enabled" | "disabled";

export const getValueEmployeeStatus = (typeString?: EmployeeStatus, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumEmployeeStatus(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Habilitado";
        case 2:
            return "Desabilitado";
        default:
            return "";
    }
}

export const getEnumEmployeeStatus = (type: EmployeeStatus) => {
    switch (type) {
        case "enabled":
            return 1;
        case "disabled":
            return 2;
        default:
            return 0;
    }
}

export const listEmployeeStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueEmployeeStatus(undefined, i));

    return list;
}

export default EmployeeStatus;
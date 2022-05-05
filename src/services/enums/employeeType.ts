enum EmployeeTypeEnum {
    Admin = 1,
    Receptionist = 2,
    Stockist = 3,
    Doctor = 4
}

export const getValueEmployeeType = (type: EmployeeTypeEnum) => {
    switch (type) {
        case EmployeeTypeEnum.Admin:
            return "Administrador";
        case EmployeeTypeEnum.Receptionist:
            return "Recepcionista";
        case EmployeeTypeEnum.Stockist:
            return "Estoquista";
        case EmployeeTypeEnum.Doctor:
            return "Médico";
        default:
            return "";
    }
}

export const listEmployeeType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 4; i++)
        list.push(getValueEmployeeType(i));

    return list;
}

export const listToRegisterEmployeeType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 3; i++)
        list.push(getValueEmployeeType(i));

    return list;
}

export default EmployeeTypeEnum;
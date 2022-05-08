enum EmployeeStatusEnum {
    Enabled = 1,
    Disabled = 2
}

export const getValueEmployeeStatus = (status: EmployeeStatusEnum) => {
    switch (status) {
        case EmployeeStatusEnum.Enabled:
            return "Habilitado";
        case EmployeeStatusEnum.Disabled:
            return "Desabilitado";
        default:
            return "";
    }
}

export const listEmployeeStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueEmployeeStatus(i));

    return list;
}

export const defineColorEmployeeStatus = (status: number) => {
    switch (status) {
        case EmployeeStatusEnum.Disabled:
            return "danger";
        case EmployeeStatusEnum.Enabled:
            return "success";
        default:
            return "";
    }
}

export default EmployeeStatusEnum;
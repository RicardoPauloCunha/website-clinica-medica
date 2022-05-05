enum MaterialStatusEnum {
    Enabled = 1,
    Disabled = 2
}

export const getValueMaterialStatus = (status: MaterialStatusEnum) => {
    switch (status) {
        case MaterialStatusEnum.Enabled:
            return "Habilitado";
        case MaterialStatusEnum.Disabled:
            return "Desabilitado";
        default:
            return "";
    }
}

export const listMaterialStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueMaterialStatus(i));

    return list;
}

export default MaterialStatusEnum;
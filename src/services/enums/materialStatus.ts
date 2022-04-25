type MaterialStatus = "able" | "disabled";

export const getValueMaterialStatus = (typeString?: MaterialStatus, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumMaterialStatus(typeString));
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

export const getEnumMaterialStatus = (type: MaterialStatus) => {
    switch (type) {
        case "able":
            return 1;
        case "disabled":
            return 2;
        default:
            return 0;
    }
}

export const listMaterialStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueMaterialStatus(undefined, i));

    return list;
}

export default MaterialStatus;
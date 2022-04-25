type MaterialInputOutputType = "input" | "output";

export const getValueMaterialInputOutputType = (typeString?: MaterialInputOutputType, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumMaterialInputOutputType(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Entrada";
        case 2:
            return "Saída";
        default:
            return "";
    }
}

export const getEnumMaterialInputOutputType = (type: MaterialInputOutputType) => {
    switch (type) {
        case "input":
            return 1;
        case "output":
            return 2;
        default:
            return 0;
    }
}

export const listMaterialInputOutputType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueMaterialInputOutputType(undefined, i));

    return list;
}

export default MaterialInputOutputType;
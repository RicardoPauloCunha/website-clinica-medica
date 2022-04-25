type GenderType = "masculine" | "feminine";

export const getValueGenderType = (typeString?: GenderType, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumGenderType(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Masculino";
        case 2:
            return "Feminino";
        default:
            return "";
    }
}

export const getEnumGenderType = (type: GenderType) => {
    switch (type) {
        case "masculine":
            return 1;
        case "feminine":
            return 2;
        default:
            return 0;
    }
}

export const listGenderType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueGenderType(undefined, i));

    return list;
}

export default GenderType;
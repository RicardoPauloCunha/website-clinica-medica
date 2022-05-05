enum GenderTypeEnum {
    Masculine = 1,
    Feminine = 2
}

export const getValueGenderType = (type: GenderTypeEnum) => {
    switch (type) {
        case GenderTypeEnum.Masculine:
            return "Masculino";
        case GenderTypeEnum.Feminine:
            return "Feminino";
        default:
            return "";
    }
}

export const listGenderType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueGenderType(i));

    return list;
}

export default GenderTypeEnum;
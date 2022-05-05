enum RecordTypeEnum {
    Input = 1,
    Output = 2
}

export const getValueRecordType = (type: RecordTypeEnum) => {
    switch (type) {
        case RecordTypeEnum.Input:
            return "Entrada";
        case RecordTypeEnum.Output:
            return "Saída";
        default:
            return "";
    }
}

export const listRecordType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueRecordType(i));

    return list;
}

export default RecordTypeEnum;
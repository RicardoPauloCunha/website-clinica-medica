type RecordType = "input" | "output";

export const getValueRecordType = (typeString?: RecordType, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumRecordType(typeString));
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

export const getEnumRecordType = (type: RecordType) => {
    switch (type) {
        case "input":
            return 1;
        case "output":
            return 2;
        default:
            return 0;
    }
}

export const listRecordType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueRecordType(undefined, i));

    return list;
}

export default RecordType;
type InvoiceType = "payment" | "refund";

export const getValueInvoiceType = (typeString?: InvoiceType, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumInvoiceType(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Pagamento";
        case 2:
            return "Ressarcimento";
        default:
            return "";
    }
}

export const getEnumInvoiceType = (type: InvoiceType) => {
    switch (type) {
        case "payment":
            return 1;
        case "refund":
            return 2;
        default:
            return 0;
    }
}

export const listInvoiceType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueInvoiceType(undefined, i));

    return list;
}

export default InvoiceType;
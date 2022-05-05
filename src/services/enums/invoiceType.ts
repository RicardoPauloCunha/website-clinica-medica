enum InvoiceTypeEnum {
    Payment = 1,
    Refund = 2 
}

export const getValueInvoiceType = (type: InvoiceTypeEnum) => {
    switch (type) {
        case InvoiceTypeEnum.Payment:
            return "Pagamento";
        case InvoiceTypeEnum.Refund:
            return "Ressarcimento";
        default:
            return "";
    }
}

export const listInvoiceType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueInvoiceType(i));

    return list;
}

export default InvoiceTypeEnum;
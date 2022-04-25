type PaymentStatus = "paid-out" | "reimbursed";

export const getValuePaymentStatus = (typeString?: PaymentStatus, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumPaymentStatus(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Pago";
        case 2:
            return "Ressarcido";
        default:
            return "";
    }
}

export const getEnumPaymentStatus = (type: PaymentStatus) => {
    switch (type) {
        case "paid-out":
            return 1;
        case "reimbursed":
            return 2;
        default:
            return 0;
    }
}

export const listPaymentStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValuePaymentStatus(undefined, i));

    return list;
}

export default PaymentStatus;
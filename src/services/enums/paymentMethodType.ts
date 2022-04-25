type PaymentMethodType = "cash" | "card" | "pix";

export const getValuePaymentMethodType = (typeString?: PaymentMethodType, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumPaymentMethodType(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Dinheiro";
        case 2:
            return "Cartão";
        case 3:
            return "PIX";
        default:
            return "";
    }
}

export const getEnumPaymentMethodType = (type: PaymentMethodType) => {
    switch (type) {
        case "cash":
            return 1;
        case "card":
            return 2;
        case "pix":
            return 3;
        default:
            return 0;
    }
}

export const listPaymentMethodType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 3; i++)
        list.push(getValuePaymentMethodType(undefined, i));

    return list;
}

export default PaymentMethodType;
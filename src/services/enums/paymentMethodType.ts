enum PaymentMethodTypeEnum {
    Cash = 1,
    Card = 2,
    Pix = 3
}

export const getValuePaymentMethodType = (type: PaymentMethodTypeEnum) => {
    switch (type) {
        case PaymentMethodTypeEnum.Cash:
            return "Dinheiro";
        case PaymentMethodTypeEnum.Card:
            return "Cartão";
        case PaymentMethodTypeEnum.Pix:
            return "PIX";
        default:
            return "";
    }
}

export const listPaymentMethodType = () => {
    let list: string[] = [];

    for (let i = 1; i <= 3; i++)
        list.push(getValuePaymentMethodType(i));

    return list;
}

export default PaymentMethodTypeEnum;
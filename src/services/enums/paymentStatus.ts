enum PaymentStatusEnum {
    PaidOut = 1,
    Reimbursed = 2
}

export const getValuePaymentStatus = (status: PaymentStatusEnum) => {
    switch (status) {
        case PaymentStatusEnum.PaidOut:
            return "Pago";
        case PaymentStatusEnum.Reimbursed:
            return "Ressarcido";
        default:
            return "";
    }
}

export const listPaymentStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValuePaymentStatus(i));

    return list;
}

export default PaymentStatusEnum;
export type AddressData = {
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
}

export const concatenateAddress = (value: AddressData) => {
    return `${value.street}, ${value.number}, ${value.district} - ${value.city}/${value.state.toUpperCase()} - ${value.cep}`;
}

export const splitAddress = (value: string | undefined) => {
    let addressData: AddressData = {
        cep: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
    }

    if (value) {
        let firstData = value.split(" - ");

        let secondData = firstData[0].split(", ");
        let thirdData = firstData[1].split("/");

        addressData = {
            cep: firstData[2],
            street: secondData[0],
            number: secondData[1],
            district: secondData[2],
            city: thirdData[0],
            state: thirdData[1],
        }
    }

    return addressData;
}
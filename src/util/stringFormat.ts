export const format = (value: string | number, pattern: string) => {
    let i = 0;
    let v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

export const formatCep = (value: string) => {
    return format(value, "#####-###");
}

export const formatCnpj = (value: string) => {
    return format(value, "##.###.###/####-##");
}

export const formatCpf = (value: string) => {
    return format(value, "###.###.###-##");
}

export const formatTelephone = (value: string) => {
    return format(value, "(##) ####-####");
}

export const formatCellphone = (value: string) => {
    return format(value, "(##) #####-####");
}

export const normalize = (value?: string) => {
    if (value === undefined)
        return "";
    else
        return value.replace(/[^0-9]/g, '');
}

export const formatQuantity = (value?: number) => {
    if (value === undefined || value === null)
        return "";
    else
        return value.toLocaleString('pt-BR');
}

export const hasValueString = (value?: string | null) => {
    if (value === "" || value === undefined || value === null)
        return false;
    else
        return true;
}

export const hasValueNumber = (value?: any) => {
    if (value === "" || value === undefined || value === null || value === 0)
        return false;
    else
        return true;
}

type AddressData = {
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
}

export const concatenateAddressData = (value: AddressData) => {
    return `${value.street}, ${value.number}, ${value.district} - ${value.city}/${value.state.toUpperCase()} - ${value.cep}`;
}

export const splitAddressData = (value: string) => {
    let firstData = value.split(" - ");

    let secondData = firstData[0].split(", ");
    let thirdData = firstData[1].split("/");

    let data: AddressData = {
        cep: firstData[2],
        street: secondData[0],
        number: secondData[1],
        district: secondData[2],
        city: thirdData[0],
        state: thirdData[1],
    }

    return data;
}
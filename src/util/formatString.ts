const format = (value: string | number, pattern: string) => {
    let i = 0;
    let v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

export const formatCep = (value: string | undefined) => {
    if (value)
        return format(value, "#####-###");

    return "";
}

export const formatCnpj = (value: string | undefined) => {
    if (value)
        return format(value, "##.###.###/####-##");

    return "";
}

export const formatCpf = (value: string | undefined) => {
    if (value)
        return format(value, "###.###.###-##");

    return "";
}

export const formatTelephone = (value: string | undefined) => {
    if (value)
        return format(value, "(##) ####-####");

    return "";
}

export const formatCellphone = (value: string | undefined) => {
    if (value)
        return format(value, "(##) #####-####");

    return "";
}

export const formatQuantity = (value: number | undefined) => {
    if (value)
        return value.toLocaleString('pt-BR');

    return "0";
}

export const normalize = (value: string | undefined) => {
    if (value)
        return value.replace(/[^0-9]/g, '');

    return "";
}

export const normalizeDate = (value: string | undefined) => {
    if (value) {
        if (value.includes("/")) {
            let dates = value.split("/");
            return `${dates[2]}-${dates[1]}-${dates[0]}T00:00:00`;
        }
        else if (!value.includes("T")){
            return `${value}T00:00:00`;
        }

        return value;
    }


    return "";
}
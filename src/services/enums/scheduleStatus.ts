type ScheduleStatus = "scheduled" | "unchecked" | "progress" | "concluded";

export const getValueScheduleStatus = (typeString?: ScheduleStatus, typeNumber?: number) => {
    let type: number;

    if (typeString !== undefined)
        type = (getEnumScheduleStatus(typeString));
    else if (typeNumber !== undefined)
        type = typeNumber;
    else
        return "";

    switch (type) {
        case 1:
            return "Agendado";
        case 2:
            return "Desmarcado";
        case 3:
            return "Andamento";
        case 4:
            return "Concluído";
        default:
            return "";
    }
}

export const getEnumScheduleStatus = (type: ScheduleStatus) => {
    switch (type) {
        case "scheduled":
            return 1;
        case "unchecked":
            return 2;
        case "progress":
            return 3;
        case "concluded":
            return 4;
        default:
            return 0;
    }
}

export const listScheduleStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 4; i++)
        list.push(getValueScheduleStatus(undefined, i));

    return list;
}

export default ScheduleStatus;
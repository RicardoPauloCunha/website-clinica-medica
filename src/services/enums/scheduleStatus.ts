enum ScheduleStatusEnum {
    Scheduled = 1,
    Unchecked = 2,
    Progress = 3,
    Concluded = 4,
    Canceled = 5,
}

export const getValueScheduleStatus = (status: ScheduleStatusEnum) => {
    switch (status) {
        case ScheduleStatusEnum.Scheduled:
            return "Agendado";
        case ScheduleStatusEnum.Unchecked:
            return "Desmarcado";
        case ScheduleStatusEnum.Progress:
            return "Andamento";
        case ScheduleStatusEnum.Concluded:
            return "Concluído";
        case ScheduleStatusEnum.Canceled:
            return "Cancelado";
        default:
            return "";
    }
}

export const listScheduleStatus = () => {
    let list: string[] = [];

    for (let i = 1; i <= 4; i++)
        list.push(getValueScheduleStatus(i));

    return list;
}

export const defineColorScheduleStatus = (status: number) => {
    switch (status) {
        case ScheduleStatusEnum.Scheduled:
            return "info";
        case ScheduleStatusEnum.Unchecked:
        case ScheduleStatusEnum.Canceled:
            return "danger";
        case ScheduleStatusEnum.Progress:
            return "warning";
        case ScheduleStatusEnum.Concluded:
            return "success";
        default:
            return "";
    }
}

export default ScheduleStatusEnum;
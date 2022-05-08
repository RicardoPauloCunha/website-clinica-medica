import { DataTextEl } from "./styles";

type DataTextProps = {
    label: string;
    value: string | undefined;
    isFullRow?: boolean;
}

const DataText = ({ label, value, isFullRow }: DataTextProps) => {
    return (
        <DataTextEl
            isFullRow={isFullRow}
        >
            <b>{label}</b>
            <span>{value}</span>
        </DataTextEl>
    );
}

export default DataText;
import React from "react";

import { CardSubtitle, CardTitle } from "reactstrap";
import { DataCardEl } from "./styles";

type DataCardProps = {
    title: string | undefined;
    subtitle?: string;
    children?: React.ReactNode;
}

const DataCard = ({ title, subtitle, children }: DataCardProps): JSX.Element => {
    return (
        <DataCardEl body>
            <CardTitle
                tag="h5"
            >
                {title}
            </CardTitle>

            {subtitle && <CardSubtitle
                className="mb-2"
            >
                {subtitle}
            </CardSubtitle>}

            {children}
        </DataCardEl>
    )
}

export default DataCard;
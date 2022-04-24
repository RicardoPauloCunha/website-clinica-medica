import React from "react"

import { CardSubtitle, CardTitle } from "reactstrap"
import { DataCardEl } from "./styles"

type DataCardProps = {
    title: string;
    children?: React.ReactNode;
}

const DataCard = ({ title, children }: DataCardProps): JSX.Element => {
    return (
        <DataCardEl body>
            <CardTitle
                tag="h5"
            >
                {title}
            </CardTitle>

            <CardSubtitle
                className="mb-2"
            >
                Card subtitle
            </CardSubtitle>

            {children}
        </DataCardEl>
    )
}

export default DataCard;
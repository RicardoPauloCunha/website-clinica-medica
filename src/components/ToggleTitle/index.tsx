import { Spinner } from "reactstrap";

type ToggleTitleProps = {
    toggle: boolean;
    isLoading: boolean;
    title: string;
    alternateTitle: string;
}

const ToggleTitle = ({toggle, isLoading, title, alternateTitle}: ToggleTitleProps) => {
    return (
        <>
            {toggle
                ? <h1>
                    {alternateTitle}

                    {isLoading && <>
                        {' '}
                        <Spinner
                            color="primary"
                            type="grow"
                        />
                    </>}
                </h1>
                : <h1>{title}</h1>
            }
        </>
    )
}

export default ToggleTitle;
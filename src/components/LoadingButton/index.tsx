import { Button, ButtonProps, Spinner } from "reactstrap"

interface LoadingButtonProps extends ButtonProps {
    text: string;
    isLoading: boolean;
}

const LoadingButton = ({ text, isLoading, ...rest }: LoadingButtonProps) => {
    return (
        <Button
            {...rest}
            disabled={isLoading}
        >
            {isLoading
                ? <Spinner size="sm" />
                : text
            }
        </Button>
    )
}

export default LoadingButton;
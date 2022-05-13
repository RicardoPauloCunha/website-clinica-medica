import { useNavigate } from "react-router-dom";
import { IconBaseProps } from "react-icons";

import { Button } from "reactstrap";
import { ActivityBlockEl } from "./styles";

type ActivityBlockProps = {
    title: string;
    link: string;
    messages: string[];
    icon: React.ComponentType<IconBaseProps>;
}

const ActivityBlock = ({title, link, messages, icon: Icon}: ActivityBlockProps) => {
    const navigate = useNavigate();

    const onClickAccess = () => {
        navigate(link);
    }

    return (
        <ActivityBlockEl>
            <div>
                <span>
                    <Icon />
                </span>
            </div>

            <h2>{title}</h2>
            
            {messages.map((x, index) => (
                <p key={index}>{x}</p>
            ))}

            <Button
                color="secondary"
                onClick={() => onClickAccess()}
            >
                Acessar
            </Button>
        </ActivityBlockEl>
    );
}

export default ActivityBlock;
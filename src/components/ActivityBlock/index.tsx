import { FaClinicMedical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Button } from "reactstrap";
import { ActivityBlockEl } from "./styles";

type ActivityBlockProps = {
    title: string;
    link: string;
    messages: string[];
}

const ActivityBlock = ({title, link, messages}: ActivityBlockProps) => {
    const navigate = useNavigate();

    const onClickAccess = () => {
        navigate(link);
    }

    return (
        <ActivityBlockEl>
            <div>
                <span>
                    <FaClinicMedical />
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
import styled from "styled-components";
import { Card } from "reactstrap";

export const DataCardEl = styled(Card)`
    background-color: var(--color-white-100);
    padding: 2rem;

    & + & {
        margin-top: 1rem;
    }

    >h5 {
        margin: 0 0 0.5rem 0;
    }
`;
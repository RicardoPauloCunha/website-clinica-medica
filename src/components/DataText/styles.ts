import styled, { css } from "styled-components";

type DataTextElProps = {
    isFullRow?: boolean;
}

export const DataTextEl = styled.div<DataTextElProps>`
    display: flex;
    flex-direction: column;

    ${props => props.isFullRow && css`
        width: 100% !important;
    `}

    >b {
        color: var(--color-black-200);
        font-weight: 600;
    }
`;
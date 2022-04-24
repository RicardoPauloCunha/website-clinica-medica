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
        color: var(--color-gray-300);
        font-weight: 600;
    }
`;
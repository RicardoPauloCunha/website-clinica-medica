import styled from "styled-components";

export const StatusBadgeEl = styled.div`
    display: flex;
    flex-direction: column;

    >b {
        color: var(--color-black-200);
        font-weight: 600;
    }

    >div {
        span {
            padding: 0.4rem 1.5rem;
            font-weight: 600;
            
            &.bg-warning {
                color: var(--color-black-200);
            }
        }
    }
`;
import styled from "styled-components";

export const NavbarProfile = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0.5rem 0 1rem 0;
    gap: 2rem;

    >div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;

        >span {
            color: var(--color-white-0);
            
            &:first-of-type {
                border-radius: 100%;
                width: 1.75rem;
                height: 1.75rem;
                background-color: var(--color-white-0);
                display: flex;
                align-items: center;
                justify-content: center;

                >svg {
                    fill: var(--color-blue-300);
                }
            }
        }
    }

    @media (min-width: 768px) {
        margin: 0;
    }
`;
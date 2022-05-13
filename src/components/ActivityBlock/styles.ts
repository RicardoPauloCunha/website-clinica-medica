import styled from "styled-components";

export const ActivityBlockEl = styled.div`
    width: calc(50% - 1rem);
    background-color: var(--color-white-100);
    border: solid 1px var(--color-gray-100);
    padding: 1.5rem 2rem;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    margin: 0 0 auto 0;

    >div:first-of-type {
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: center;

        >span {
            width: 3rem;
            height: 3rem;
            background-color: var(--color-blue-300);
            border-radius: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            bottom: 2.5rem;

            >svg {
                font-size: 1.5rem;
                fill: var(--color-white-0)
            }
        }
    } 

    >h2 {
        margin-top: 0;
    }

    p + button {
        margin-top: 1rem;
    }
`;
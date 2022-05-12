import styled from "styled-components";

export const DataCardEl = styled.div`
    width: 100%;
    background-color: var(--color-white-100);
    border: solid 1px var(--color-gray-100);
    padding: 1.5rem 2rem;
    border-radius: 0.25rem;

    display: grid;
    gap: 0.5rem 1rem;

    & + & {
        margin-top: 1rem;
    }

    >div {
        &:first-child {
            grid-area: name;

            b {
                font-size: 1.1rem;
            }
        }
    }

    button {
        margin: 0 0 0 auto;
        height: 2.5rem;
        padding: 0.4rem 1rem !important;
    }

    &.data-card-attendance {
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(2, auto);
        grid-template-areas:
        "name name serv serv doct doct"
        "comm comm comm diag diag diag";

        >div {
            &:nth-child(2) {
                grid-area: serv;
            }

            &:nth-child(3) {
                grid-area: doct;
            }

            &:nth-child(4) {
                grid-area: comm;
            }

            &:nth-child(5) {
                grid-area: diag;
            }
        }
    }

    &.data-card-employee {
        grid-template-columns: repeat(2, 1fr) 0.5fr 5rem;
        grid-template-rows: repeat(1, auto);
        grid-template-areas:
        "name sect stat butt";

        >div {
            &:nth-child(2) {
                grid-area: sect;
            }

            &:nth-child(3) {
                grid-area: stat;
            }
        }

        >button {
            grid-area: butt;
        }
    }

    &.data-card-material {
        grid-template-columns: repeat(3, 1fr) 9rem;
        grid-template-rows: repeat(2, auto);
        grid-template-areas:
        "name cate manu butt"
        "desc desc desc butt";

        >div {
            &:nth-child(2) {
                grid-area: cate;
            }

            &:nth-child(3) {
                grid-area: manu;
            }

            &:nth-child(4) {
                grid-area: desc;
            }

            &:nth-child(5) {
                grid-area: butt;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
        }
    }

    &.data-card-material-record {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, auto);
        grid-template-areas:
        "name spec"
        "desc desc";

        >div {
            &:nth-child(2) {
                grid-area: spec;
            }

            &:nth-child(3) {
                grid-area: desc;
            }
        }
    }

    &.data-card-scheduling {
        grid-template-columns: repeat(4, 1fr) 5rem;
        grid-template-rows: auto;
        grid-template-areas:
        "name stat serv doct butt";

        >div {
            &:nth-child(2) {
                grid-area: stat;
            }

            &:nth-child(3) {
                grid-area: serv;
            }

            &:nth-child(4) {
                grid-area: doct;
            }
        }

        >button {
            grid-area: butt;
        }
    }

    &.data-card-scheduling-doctor {
        grid-template-columns: repeat(3, 1fr) 5rem;
        grid-template-rows: auto;
        grid-template-areas:
        "name stat serv butt";

        >div {
            &:nth-child(2) {
                grid-area: stat;
            }

            &:nth-child(3) {
                grid-area: serv;
            }
        }

        >button {
            grid-area: butt;
        }
    }

    &.data-card-service {
        grid-template-columns: repeat(2, 1fr) 5rem;
        grid-template-rows: repeat(2, auto);
        grid-template-areas:
        "name spec butt"
        "desc desc desc";

        >div {
            &:nth-child(2) {
                grid-area: spec;
            }

            &:nth-child(3) {
                grid-area: desc;
            }
        }

        >button {
            grid-area: butt;
        }
    }
`;
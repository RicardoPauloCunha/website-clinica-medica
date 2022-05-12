import { AccordionItem } from "reactstrap";
import styled from "styled-components";

export const CollapseCardEl = styled(AccordionItem)`
    background-color: var(--color-white-0);
    margin-bottom: 1rem;

    h2 {
        margin: 0;
    }

    .accordion-button {
        font-weight: 500;
        font-size: 1rem;
        color: var(--color-black-100);
        background-color: var(--color-white-0);
        box-shadow: none;
    }

    .accordion-button:not(.collapsed) {
        border-bottom: solid 1px var(--color-gray-100);
    }

    .accordion-body {
        display: grid;
        gap: 0.5rem 1rem;
    }

    &.collapse-card-color-gray {
        .accordion-button {
            background-color: var(--color-white-100);
        }

        .accordion-button:not(.collapsed) {
            background-color: var(--color-white-100);
        }

        .accordion-body {
            background-color: var(--color-white-100);
        }
    }

    &.collapse-card-doctor {
        .accordion-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas:
            "emai";

            >div {
                &:nth-child(1) {
                    grid-area: emai;
                }
            }
        }
    }

    &.collapse-card-manufacturer {
        .accordion-body {
            grid-template-columns: 10rem 1fr;
            grid-template-rows: auto;
            grid-template-areas:
            "cont addr";

            >div {
                &:nth-child(1) {
                    grid-area: cont;
                }

                &:nth-child(2) {
                    grid-area: addr;
                }
            }
        }
    }

    &.collapse-card-material {
        margin-bottom: 2rem;
        background-color: var(--color-white-100);

        .accordion-body {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, auto);
            grid-template-areas:
            "name cate manu"
            "desc desc desc";

            >div {
                &:nth-child(1) {
                    grid-area: name;
                }

                &:nth-child(2) {
                    grid-area: cate;
                }

                &:nth-child(3) {
                    grid-area: manu;
                }

                &:nth-child(4) {
                    grid-area: desc;
                }
            }
        }
    }

    &.collapse-card-patient {
        .accordion-body {
            grid-template-columns: 10rem 1fr 7rem;
            grid-template-rows: auto;
            grid-template-areas:
            "cont addr butt";

            >div {
                &:nth-child(1) {
                    grid-area: cont;
                }

                &:nth-child(2) {
                    grid-area: addr;
                }
            }

            >button {
                grid-area: butt;
                margin: 0 0 0 auto;
                height: 2.5rem;
                padding: 0.4rem 1rem !important;
            }
        }
    }

    &.collapse-card-payment {
        .accordion-body {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            grid-template-areas:
            "disc meth";

            >div {
                &:nth-child(1) {
                    grid-area: disc;
                }

                &:nth-child(2) {
                    grid-area: meth;
                }
            }
        }
    }

    &.collapse-card-scheduling {
        .accordion-body {
            grid-template-columns: auto(4, 1fr);
            grid-template-rows: auto;
            grid-template-areas:
            "cpf cont date stat"
            "serv serv doct spec";

            >div {
                &:nth-child(1) {
                    grid-area: cpf;
                }

                &:nth-child(2) {
                    grid-area: cont;
                }

                &:nth-child(3) {
                    grid-area: date;
                }

                &:nth-child(4) {
                    grid-area: stat;
                }

                &:nth-child(5) {
                    grid-area: serv;
                }

                &:nth-child(6) {
                    grid-area: doct;
                }

                &:nth-child(7) {
                    grid-area: spec;
                }
            }
        }
    }

    &.collapse-card-service {
        .accordion-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas:
            "desc";

            >div {
                &:nth-child(1) {
                    grid-area: desc;
                }
            }
        }
    }
`;
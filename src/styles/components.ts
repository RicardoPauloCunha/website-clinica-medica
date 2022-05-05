import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import { Modal } from 'reactstrap';

export const Form = styled(Unform)`
    border-radius: 0.25rem;

    &.form-data {
        margin: 2rem 0;
        padding: 2rem;
        background-color: var(--color-white-100);
        border: 1px solid rgba(0,0,0,.125);

        >button {
            margin-top: 1rem;
            width: 100%;
        }
    }

    &.form-search {
        margin: 2rem 0;
        background-color: var(--color-white-0);
    }

    &.form-modal {
        margin: 0;
        background-color: var(--color-white-0);

        .alert {
            margin: 2rem 0 1rem 0;
        }
    }

    &.form-data, &.form-search {
        .col-md-2 {
            >button {
                padding: 0.5rem 1rem 0.5rem 1rem !important;
                margin-top: 1rem;
                width: 100%;
            }
        }

        @media (min-width: 768px) {
            .col-md-2 {
                >button {
                margin-top: 1.85rem;
                }
            }
        }

        @media (min-width: 992px) {
            .col-md-2 {
                >button {
                    padding: 0.5rem 2rem 0.5rem 2rem !important;
                }
            }
        }
    }
`;

export const TextGroupGrid = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    >div {
        min-width: 100%;
    }

    @media (min-width: 768px) {
        >div {
            min-width: calc((100% / 2) - (1rem / 2));
        }
    }

    @media (min-width: 1200px) {
        >div {
            min-width: calc((100% / 3) - (2rem / 3));
        }

        &.text-group-grid-modal {
            >div {
                min-width: calc((100% / 2) - (1rem / 2));
            }
        }
    }
`;

export const ButtonGroupRow = styled.div`
    width: 100%;
    padding-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;

    .mb-3 + & {
        padding-top: 0;
    }
`;

export const DataModal = styled(Modal)`
    .modal-content {
        padding: 1rem;
    }

    .modal-header {
        border: none;
        padding-bottom: 0;
    }

    .modal-title {
        margin: 0;
    }

    .modal-footer {
        border: none;
        padding-top: 0;

        >button:last-of-type {
            background-color: var(--color-gray-200);
        }
    }
`;
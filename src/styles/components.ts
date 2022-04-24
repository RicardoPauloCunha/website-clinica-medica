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
    .modal-header {
        border: none;
        padding-bottom: 0;
    }

    .modal-footer {
        border: none;
        padding-top: 0;

        >button:last-of-type {
            background-color: var(--color-gray-200);
        }
    }
`;
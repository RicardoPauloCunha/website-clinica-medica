import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: var(--color-black-100);
    }

    :root {
        --color-white-0: #FFFFFF;
        --color-white-100: #F3F3F3;

        --color-black-100: #212529;

        --color-gray-100: #C6CDD8;
        --color-gray-200: #6C757D;
        --color-gray-300: #4A5C73;

        --color-blue-200: #4198F7;
        --color-blue-300: #0D53FC;

        --color-green-200: #49C496;
    }

    body {
        background-color: var(--color-white-0);
        width: 100%;
        height: 100%;
    }

    h1 {
        color: var(--color-black-100);
        margin-bottom: 2rem;
        text-align: center;
    }

    h2, h3 {
        color: var(--color-gray-300);
        margin: 1.5rem 0;
    }

    h4, h5, h6 {
        color: var(--color-black-100);
        margin: 1.5rem 0;
    }

    button {
        color: var(--color-white-0) !important;
        font-weight: 500 !important;
        padding: 0.5rem 2rem 0.5rem 2rem !important;
        
        & + button {
            margin-left: 1rem;
        }

        .spinner-border {
            color: var(--color-white-0);
        }
    }

    .alert {
        margin: 2rem 0 0 0;
    }
`;
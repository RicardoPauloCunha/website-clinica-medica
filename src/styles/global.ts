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
        --color-white-100: #f9f9f9;

        --color-black-100: #212529;
        --color-black-200: #1f2732;

        --color-gray-100: #C6CDD8;
        --color-gray-200: #6C757D;
        --color-gray-300: #374558;

        --color-blue-100: #E5F6FF;
        --color-blue-300: #2C43C3;

        --color-green-100: #83DAA3;
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

    h2 {
        color: var(--color-gray-300);
        margin: 3rem 0 1rem;

        form + & {
            margin-top: 5rem;
        }
    }

    h3 {
        color: var(--color-gray-300);
        margin: 2rem 0 1rem;
    }

    h4, h5, h6 {
        color: var(--color-black-100);
        margin: 1.5rem 0;
    }

    button {
        &.btn {
            font-weight: 500;
            padding: 0.5rem 2rem 0.5rem 2rem;
        }
        
        & + button {
            margin-left: 1rem;
        }

        &.btn-block {
            width: 100%;
        }
    }

    .alert {
        margin: 2rem 0 0 0;

        p + & {
            margin: 1rem 0 0 0;
        }
    }

    small {
        &.text-link-action {
            color: var(--color-blue-300);
            font-weight: 500;
            padding-bottom: 0rem;
            border-bottom: solid 2px var(--color-blue-300);
            cursor: pointer;
            transition: font-weight 0.3s, border-bottom 0.3s;

            &:hover {
                font-weight: 400;
                border-bottom: solid 1px var(--color-blue-300);
            }

            &:active {
                font-weight: 500;
                border-bottom: none;
            }
        }
    }

    nav {
        &.navbar.fixed-top {
            min-height: 3rem;
        }
    }
`;
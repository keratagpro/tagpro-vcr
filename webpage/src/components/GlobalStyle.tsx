import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    .game-frame {
        width: 100%;
        min-width: 1280px;
        min-height: 800px;
    }

    body {
        max-width: initial;
        margin: initial;
    }

    html,
    body,
    #root,
    #container {
        height: 100%;
    }

    #container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    header {
        width: 100%;
        max-width: 800px;
        margin: 20px auto;
    }

    #game-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        flex: 10;
    }

    .info {
        max-width: 800px;
        width: 100%;
    }

    #game-frame {
        width: 100%;
        height: 100%;
    }

    .form-upload {
        display: flex;
        align-items: baseline;
    }

    .form-fetch {
        display: flex;
        flex: 1;
        align-items: baseline;
    }

    .form-fetch input {
        flex: 1;
    }

    .form-fetch-icon {
        width: 30px;
    }

    .button {
        color: #ffffff;
        background-color: #161f27;
        font-family: inherit;
        font-size: inherit;
        margin-right: 6px;
        margin-bottom: 6px;
        padding: 10px;
        border: none;
        border-radius: 6px;
        outline: none;
    }

    li {
        line-height: 2;
    }

    .logo {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .recorder {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
    }

    .recording {
        animation: blinker 1s linear infinite;
    }

    @keyframes blinker {
        50% {
            opacity: 0;
        }
    }

`;

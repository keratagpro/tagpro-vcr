import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        height: 100%;
    }

    body {
        max-width: initial;
        margin: initial;
    }

    .game-frame {
        width: 100%;
        min-width: 1280px;
        min-height: 800px;
    }
`;

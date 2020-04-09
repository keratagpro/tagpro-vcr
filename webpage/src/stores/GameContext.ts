import * as React from 'react';

import { GameState } from './GameState';

export const GameContext = React.createContext<GameState>(null);

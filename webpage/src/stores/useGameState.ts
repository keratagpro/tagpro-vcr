import { useContext } from 'react';

import GameContext from './GameContext';

export default function useGameState() {
	return useContext(GameContext);
}

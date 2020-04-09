import { useContext } from 'react';

import { AppContext } from './AppContext';

export function useAppState() {
	return useContext(AppContext);
}

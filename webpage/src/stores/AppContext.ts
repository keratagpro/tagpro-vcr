import * as React from 'react';

import { AppState } from './AppState';

export const AppContext = React.createContext<AppState>(null);

import { createContext } from 'react';

import type { FlowContextType } from './types';
import { FLOW_STATE_INIT, FLOW_STATUS_SUCCESS } from './constants';

export const FlowContext = createContext<FlowContextType>({
  getState: () => FLOW_STATE_INIT,
  setState: () => null,

  status: FLOW_STATUS_SUCCESS,
  setStatus: () => null,
});

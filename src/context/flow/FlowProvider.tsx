import React, {ReactNode, useRef, useState} from 'react';

import type {FlowStates, FlowContextType, FlowStatus} from './types';
import {FLOW_STATE_INIT, FLOW_STATUS_SUCCESS} from './constants';
import {FlowContext} from './flowContext';

type Props = {
  children: ReactNode;
};

export const FlowProvider = ({children}: Props) => {
  const state = useRef<FlowStates>(FLOW_STATE_INIT);
  const getState = () => state.current;
  const setState = (value: FlowStates) => (state.current = value);

  const [status, setStatus] = useState<FlowStatus>(FLOW_STATUS_SUCCESS);

  const value: FlowContextType = {
    getState,
    setState,

    status,
    setStatus,
  };
  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

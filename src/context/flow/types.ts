import {
  FLOW_EVENT_INIT,
  FLOW_STATE_INIT,
  FLOW_STATE_SAMPLE_STATE,
  FLOW_STATUS_ERROR,
  FLOW_STATUS_SUCCESS,
} from './constants';

export type FlowStates =
  | typeof FLOW_STATE_SAMPLE_STATE
  | typeof FLOW_STATE_INIT;

export type FlowStatus = typeof FLOW_STATUS_SUCCESS | typeof FLOW_STATUS_ERROR;

export type FlowEvents = keyof FlowEventPayloadsList;
export type FlowPayloadType<T extends FlowEvents> = FlowEventPayloadsList[T];

export type FlowContextType = {
  getState: () => FlowStates;
  setState: (value: FlowStates) => void;

  status: FlowStatus;
  setStatus: (value: FlowStatus) => void;
};

export type FlowEventPayloadsList = {
  [FLOW_EVENT_INIT]: null;
};

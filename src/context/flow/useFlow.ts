import { useCallback, useContext, useRef } from 'react';

import { Alert, InteractionManager } from 'react-native';

import type {
  FlowEvents,
  FlowStates,
  FlowStatus,
  FlowPayloadType,
} from './types';

import {
  FLOW_EVENT_INIT,
  FLOW_STATE_INIT,
  FLOW_STATUS_ERROR,
  FLOW_STATUS_SUCCESS,
} from './constants';

import { FlowContext } from './flowContext';

type EventHandlersType = {
  [Property in FlowEvents]?: {
    validStates: FlowStates[] | null;
    handlerFunc: (payload: FlowPayloadType<Property>) => Promise<FlowStatus>;
  };
};

type EmitFlowEventType = <T extends FlowEvents>(
  event: T,
  payload: FlowPayloadType<T>,
) => void;

const getEmitEventDumpString = (value: any) => {
  return JSON.stringify(value);
};

export const useFlow = () => {
  const flowContext = useContext(FlowContext);
  const { getState } = flowContext;
  const { status, setStatus } = flowContext;

  const _emitFlowEvent = useRef<EmitFlowEventType>(() => null);

  const emitFlowEvent = useCallback<EmitFlowEventType>((event, payload) => {
    InteractionManager.runAfterInteractions(() =>
      _emitFlowEvent.current(event, payload),
    );
  }, []);

  _emitFlowEvent.current = useCallback<EmitFlowEventType>(
    (event, payload) => {
      const eventHandlers: EventHandlersType = {
        [FLOW_EVENT_INIT]: {
          validStates: null,
          handlerFunc: async () => {
            const state = getState();
            if (state !== FLOW_STATE_INIT) {
              return FLOW_STATUS_SUCCESS;
            }

            return FLOW_STATUS_SUCCESS;
          },
        },
      };

      const handleEvent = async <T extends FlowEvents>(
        event: T,
        payload: FlowPayloadType<T>,
      ) => {
        try {
          const eventHandler = eventHandlers[event];
          if (eventHandler == null) {
            throw new Error('Unhandled event type');
          }

          const { validStates, handlerFunc } = eventHandler;

          const state = getState();

          if (validStates != null && !validStates.includes(state)) {
            throw new Error('Invalid event on current state');
          }

          const result = await handlerFunc(payload);
          const dumpString = getEmitEventDumpString({
            state,
            event,
            payload,
          });
          const resultString = JSON.stringify(result);
          console.log(`Flow event ${dumpString}: ${resultString}`);

          setStatus(result);
        } catch (error) {
          const state = getState();
          const dumpString = getEmitEventDumpString({
            state,
            event,
            payload,
          });
          console.error(`Flow error ${dumpString}: ${error}`);
          Alert.alert('Error', `Flow error ${dumpString}: ${error}`);

          // setState(FLOW_STATE_MAIN_MENU);

          setStatus(FLOW_STATUS_ERROR);
        }
      };

      handleEvent(event, payload);
    },
    [getState, setStatus],
  );

  return {
    emitFlowEvent,
    status,
  };
};

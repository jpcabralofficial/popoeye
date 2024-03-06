import { useCallback, useContext, useRef } from 'react';
import { Alert, InteractionManager, Image } from 'react-native';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import { useDispatch } from 'react-redux';

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
  FLOW_EVENT_CHECK_MEMBERSHIP,
  FLOW_EVENT_PRINT,
} from './constants';

import { FlowContext } from './flowContext';

import {
  ResultCodes,
  RunClassName,
  srnKotlinRun,
} from '../../shared/srnKotlinRun';

import useFlowNavigation from './useFlowNavigation';
import { setProducts } from '../../common/redux/slices/product/product';
import { clearCart } from '../../common/redux/slices/cart/cart';
import { FULFILLMENT_NAV, ONBOARDING_NAV } from '../../utils/navigation';

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
  const dispatch = useDispatch();
  const { navigateMain } = useFlowNavigation();
  const flowContext = useContext(FlowContext);
  const { getState } = flowContext;
  const { status, setStatus } = flowContext;

  const uuid = uuidv4();

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

            if (status === FLOW_STATUS_SUCCESS) {
              navigateMain(ONBOARDING_NAV);
            }

            const resInitSettings = await srnKotlinRun(
              RunClassName.InitializeSettings,
              undefined,
            );

            await srnKotlinRun(RunClassName.UpdateSettings, {
              settings: [{ key: 'DeviceName', newValue: 'CentralKiosk' }],
            });

            if (resInitSettings.response.resultCode !== ResultCodes.Success) {
              throw new Error(
                `Invalid initialize settings result: ${JSON.stringify(
                  resInitSettings,
                )}`,
              );
            }

            await srnKotlinRun(RunClassName.MerchantLogin, {
              username: 'dev-kuyaj_store-owner@yopmail.com',
              password: 'iFqhiDy?',
            });

            const resGetAllProducts = await srnKotlinRun(
              RunClassName.GetProductsFromParrot,
              undefined,
            );
            const responseProducts = resGetAllProducts.response.products;
            const productsMapped = _.map(responseProducts, product => {
              return {
                id: product._id,
                sku: product.sku,
                name: product.name,
                description: product.description,
                price: product.prices
                  .find((price: any) => price.name === 'instore')
                  ?.price.toString(),
                categories: product.categories[0].name,
                tags: product.tags,
                status: product.status,
                visibility: product.visibility.toString(),
                images: product.images[0].images,
                image_thumbnail: product.images[0].thumbnail,
              };
            });

            dispatch(setProducts(productsMapped));

            const prefetchTasks: Promise<boolean>[] = [];
            productsMapped.forEach(p => {
              if (p.images.uri != null) {
                prefetchTasks.push(Image.prefetch(p.images.uri));
              }
            });

            Promise.all(prefetchTasks).then(value => {
              console.log('prefetched images:', value.length);
            });

            return FLOW_STATUS_SUCCESS;
          },
        },
        [FLOW_EVENT_CHECK_MEMBERSHIP]: {
          validStates: null,
          handlerFunc: async payload => {
            const dataResponse = await srnKotlinRun(
              RunClassName.GetMemberById,
              { id: payload.id },
            );

            if (dataResponse.response.resultCode === ResultCodes.Success) {
              navigateMain(FULFILLMENT_NAV);
            }

            return FLOW_STATUS_SUCCESS;
          },
        },
        [FLOW_EVENT_PRINT]: {
          validStates: null,
          handlerFunc: async payload => {
            const numericUuid = uuid.replace(/-/g, '');
            const formattedUuid = numericUuid
              .replace(/(.{4})/g, '$1-')
              .slice(0, -1);

            const currentDate = new Date();
            const formattedDate = `${(currentDate.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${currentDate
              .getDate()
              .toString()
              .padStart(2, '0')}/${currentDate.getFullYear()}`;

            const dataResponse = await srnKotlinRun(RunClassName.Print, {
              action: 'PRINT_CENTRAL_KIOSK_QUEUE_TICKET',
              transaction_type: 'SALE',
              uuid: formattedUuid,
              queueParams: {
                number: payload.queueNumber.toString(),
                where: payload.fulfillmentType,
                date: formattedDate,
                items: payload.items,
              },
            });

            console.log('print: ', payload);

            if (dataResponse.response.resultCode === ResultCodes.Success) {
              navigateMain(ONBOARDING_NAV);
              dispatch(clearCart());
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
    [getState, setStatus, navigateMain, status, dispatch, uuid],
  );

  return {
    emitFlowEvent,
    status,
  };
};

import { useCallback, useContext, useRef } from 'react';
import { Alert, InteractionManager, Image, Linking } from 'react-native';

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
  FLOW_EVENT_PAY_VIA_TPAI,
  FLOW_EVENT_CARD_PAYMENT,
  FLOW_EVENT_PRINT_CASHLESS,
} from './constants';

import { FlowContext } from './flowContext';

import {
  ResultCodes,
  RunClassName,
  srnKotlinRun,
} from '../../shared/srnKotlinRun';

import useFlowNavigation from './useFlowNavigation';

import { setProducts } from '../../common/redux/slices/product/product';
import {
  clearMembershipBarcode,
  setMembershipBarcode,
  setMembershipType,
} from '../../common/redux/slices/membership/membership';
import {
  clearPaymentStatus,
  setPaymentStatus,
} from '../../common/redux/slices/checkout/checkout';
import { clearCart } from '../../common/redux/slices/cart/cart';
import { FULFILLMENT_NAV, ONBOARDING_NAV } from '../../utils/navigation';

import {
  EventName,
  srnKotlinSetEventHandlers,
} from '../../shared/srnKotlinSetEventHandlers';
import { srnKotlinRequestPermissions } from '../../shared/srnKotlinRequestPermissions';

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

  const { getOrderParams, setOrderParams } = flowContext;

  const connectSocket = async () => {
    await srnKotlinRun(RunClassName.TerminateSocket, undefined);
    const resInitSocket = await srnKotlinRun(
      RunClassName.InitializeSocket,
      undefined,
    );
    if (resInitSocket.response.resultCode !== ResultCodes.Success) {
      throw new Error(
        `Invalid initialize socket result: ${JSON.stringify(resInitSocket)}`,
      );
    }
  };

  const checkPaymentStatus = useCallback(
    async (paymentInfo: {
      id: string;
      startParams: any;
      pendingCounter: number;
      startedCounter: number;
    }) => {
      const resStatus = await srnKotlinRun(RunClassName.CheckPaymentStatus, {
        transactionId: paymentInfo.id,
      });

      const paymentStatus = resStatus.response.status;
      console.log(paymentStatus, 'gg');
      console.log(resStatus.response.approvalCode);
      dispatch(setPaymentStatus(paymentStatus));

      if (
        paymentStatus === 'SUCCESSFUL' ||
        paymentStatus === 'FAILED' ||
        paymentStatus === 'CANCELLED'
      ) {
        let params = '';
        params += `action=${encodeURIComponent('PAYMENT')}`;
        params += `&id=${encodeURIComponent(paymentInfo.id)}`;
        params += `&status=${encodeURIComponent(paymentStatus)}`;
        params += `&approvalCode=${encodeURIComponent(
          resStatus.response.approvalCode,
        )}`;

        if (paymentStatus === 'SUCCESSFUL') {
          const resUpdateOrderPayment = await srnKotlinRun(
            RunClassName.UpdateOrderPayment,
            {
              uuid: getOrderParams().selectedUuid,
              approvalCode: resStatus.response.approvalCode,
              modeOfPayment: 'Online Credit Card',
            },
          );

          console.log(resUpdateOrderPayment);
        }

        const url = `srspos://main/reviewOrder?${params}`;
        Linking.openURL(url);
      } else {
        if (paymentStatus === 'PENDING') {
          paymentInfo.pendingCounter++;
          if (paymentInfo.pendingCounter >= 6) {
            const { response } = await srnKotlinRun(
              RunClassName.StartPayment,
              paymentInfo.startParams,
            );
            paymentInfo.id = response.transactionId;
            paymentInfo.pendingCounter = 0;
          }
          setTimeout(() => checkPaymentStatus(paymentInfo), 5000);
        } else if (paymentStatus === 'STARTED') {
          paymentInfo.startedCounter++;
          if (paymentInfo.startedCounter >= 30) {
            let params = '';
            params += `id=${encodeURIComponent(paymentInfo.id)}`;
            params += `&status=${encodeURIComponent('FAILED')};`;

            const url = `srspos://main/reviewOrder?${params}`;
            Linking.openURL(url);
          } else {
            setTimeout(() => checkPaymentStatus(paymentInfo), 5000);
          }
        }
      }
    },
    [dispatch],
  );

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

            await srnKotlinRequestPermissions();

            if (status === FLOW_STATUS_SUCCESS) {
              navigateMain(ONBOARDING_NAV);
            }

            const resInitSettings = await srnKotlinRun(
              RunClassName.InitializeSettings,
              undefined,
            );

            if (resInitSettings.response.resultCode !== ResultCodes.Success) {
              throw new Error(
                `Invalid initialize settings result: ${JSON.stringify(
                  resInitSettings,
                )}`,
              );
            }

            // await srnKotlinRun(RunClassName.UpdateSettings, {
            //   settings: [{ key: 'DeviceName', newValue: 'CentralKiosk' }],
            // });

            await srnKotlinRun(RunClassName.MerchantLogin, {
              username: 'dev-kuyaj_store-owner@yopmail.com',
              password: 'iFqhiDy?',
            });

            await srnKotlinRun(RunClassName.EmployeeLogin, {
              accessCode: '689460',
              shouldUpdateDeviceConfig: true,
            });

            await connectSocket();

            const resGetProductsFromParrot = await srnKotlinRun(
              RunClassName.GetProductsFromParrot,
              undefined,
            );

            if (resGetProductsFromParrot.isSuccess) {
              const resGetAllProducts = await srnKotlinRun(
                RunClassName.GetAllProducts,
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
                  variants: product.variants,
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
            }

            srnKotlinSetEventHandlers({
              [EventName.OnConnect]: ({ data }) => {
                srnKotlinRun(RunClassName.JoinSocketRoom, undefined);
                console.debug(`EVENT OnConnect: ${JSON.stringify(data)}`);
              },
              [EventName.OnConnectError]: ({ data }) => {
                console.debug(`EVENT OnConnectError: ${JSON.stringify(data)}`);
                setTimeout(() => connectSocket(), 5000);
              },
              [EventName.OnScannerRead]: ({ data }) => {
                console.log(data);
                console.debug(
                  `EVENT OnScannerReadError: ${JSON.stringify(data)}`,
                );
                console.log('OnScannerReadResponse', data);
                dispatch(setMembershipBarcode(data?.scanData));
              },

              [EventName.StartPayment]: ({ data }) => {
                console.debug(`EVENT StartPayment: ${JSON.stringify(data)}`);
              },

              [EventName.UpdatePaymentStatus]: ({ data }) => {
                console.debug(
                  `EVENT UpdatePaymentStatus: ${JSON.stringify(data)}`,
                );
                const status = data.eventMessage.status;

                console.log(status, 'updatePayment');
                if (
                  status === 'SUCCESSFUL' ||
                  status === 'FAILED' ||
                  status === 'CANCELED'
                ) {
                  let params = '';
                  params += `action=${encodeURIComponent('PAYMENT')}`;
                  params += `&id=${encodeURIComponent(data.eventMessage.id)}`;
                  params += `&status=${encodeURIComponent(
                    data.eventMessage.status,
                  )}`;
                  params += `&approvalCode=${encodeURIComponent(
                    data.eventMessage.approval_code,
                  )}`;

                  const url = `srspos://main/reviewOrder?${params}`;
                  Linking.openURL(url);
                }
              },
            });

            return FLOW_STATUS_SUCCESS;
          },
        },
        [FLOW_EVENT_CARD_PAYMENT]: {
          validStates: null,
          handlerFunc: async payment => {
            await srnKotlinRun(RunClassName.UpdateOrderPayment, {
              uuid: payment.uuid,
              approvalCode: payment.approvalCode,
              modeOfPayment: 'Online Credit Card',
            });

            return 'FLOW_STATUS_SUCCESS';
          },
        },
        [FLOW_EVENT_PAY_VIA_TPAI]: {
          validStates: null,
          handlerFunc: async payment => {
            await srnKotlinRun(RunClassName.EmployeeLogin, {
              accessCode: '689460',
              shouldUpdateDeviceConfig: true,
            });

            const resGetAllOrders = await srnKotlinRun(
              RunClassName.CreateOrder,
              {
                diningOption: 'Take-out',
                skuList: payment.skuList,
                numberOfPax: 3,
                customer: {},
              },
            );

            setOrderParams({
              ...getOrderParams(),
              selectedUuid: resGetAllOrders.response.uuid,
            });

            const startParams = {
              transactionType: 'SALE',
              industryType: 'RETAIL',
              csNumber: 0,
              amount: payment.amount.toFixed(2),
              tax: payment.tax,
              tip: payment.tip,
            };
            const { response } = await srnKotlinRun(
              RunClassName.StartPayment,
              startParams,
            );

            let params = '';
            params += `id=${encodeURIComponent(response.transactionId)}`;
            params += `&transaction_type=${encodeURIComponent('SALE')}`;
            params += `&industry_type=${encodeURIComponent('RETAIL')}`;
            params += `&cs_number=${encodeURIComponent(0)}`;
            params += `&amount=${encodeURIComponent(payment.amount)}`;
            params += `&tax=${encodeURIComponent(payment.tax)}`;
            params += `&tip=${encodeURIComponent(payment.tip)}`;

            const url = `tpapay://main/landing?${params}`;
            const canOpenPay = await Linking.canOpenURL(url);
            if (canOpenPay) {
              Linking.openURL(`tpapay://main/landing?${params}`);
            }

            await checkPaymentStatus({
              id: response.transactionId,
              startParams: startParams,
              pendingCounter: 0,
              startedCounter: 0,
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

            if (
              dataResponse.response.resultCode !== ResultCodes.Success &&
              dataResponse.response.resultMessage ===
                'Membership ID does not exist.'
            ) {
              dispatch(setMembershipType('not exist'));
            } else if (
              dataResponse.response.resultCode === ResultCodes.Success &&
              dataResponse.response.data.status === 'Expired'
            ) {
              dispatch(setMembershipType('expired'));
            } else if (
              dataResponse.response.resultCode === ResultCodes.Success &&
              dataResponse.response.data.status === 'Active'
            ) {
              dispatch(setMembershipType('active'));
              navigateMain(FULFILLMENT_NAV);
            }

            return FLOW_STATUS_SUCCESS;
          },
        },
        [FLOW_EVENT_PRINT]: {
          validStates: null,
          handlerFunc: async payload => {
            const currentDate = new Date();
            const formattedDate = `${(currentDate.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${currentDate
              .getDate()
              .toString()
              .padStart(2, '0')}/${currentDate.getFullYear()}`;

            const resGetAllOrders = await srnKotlinRun(
              RunClassName.CreateOrder,
              {
                diningOption: 'Take-out',
                skuList: payload.skuList,
                numberOfPax: 3,
                customer: {},
              },
            );

            const dataResponse = await srnKotlinRun(RunClassName.Print, {
              action: 'PRINT_POPEYES_KIOSK_QUEUE_TICKET',
              transaction_type: 'SALE',
              uuid: resGetAllOrders.response.uuid,
              queueParams: {
                number: payload.queueNumber.toString(),
                where: payload.fulfillmentType,
                date: formattedDate,
                items: payload.skuList,
              },
            });

            console.log('print: ', payload);

            if (dataResponse.response.resultCode === ResultCodes.Success) {
              navigateMain(ONBOARDING_NAV);
              dispatch(clearCart());
              dispatch(clearMembershipBarcode());
              dispatch(clearCart());
              dispatch(clearPaymentStatus());
            }

            return FLOW_STATUS_SUCCESS;
          },
        },
        [FLOW_EVENT_PRINT_CASHLESS]: {
          validStates: null,
          handlerFunc: async payload => {
            // const resGetAllOrders = await srnKotlinRun(
            //   RunClassName.CreateOrder,
            //   {
            //     diningOption: 'Take-out',
            //     skuList: payload.skuList,
            //     numberOfPax: 3,
            //     customer: {},
            //   },
            // );
            // console.log(resGetAllOrders);

            // setOrderParams({
            //   ...getOrderParams(),
            //   selectedUuid: resGetAllOrders.response.uuid,
            // });

            const resPrintCashless = await srnKotlinRun(RunClassName.Print, {
              action: 'PRINT_POPEYES_ORDER_RECEIPT',
              transaction_type: 'SALE',
              uuid: getOrderParams().selectedUuid,
              queueNumber: payload.queueNumber.toString(),
            });

            console.log(resPrintCashless);

            if (resPrintCashless.response.resultCode === ResultCodes.Success) {
              navigateMain(ONBOARDING_NAV);
              dispatch(clearCart());
              dispatch(clearMembershipBarcode());
              dispatch(clearCart());
              dispatch(clearPaymentStatus());
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
    [
      getState,
      setStatus,
      navigateMain,
      status,
      dispatch,
      checkPaymentStatus,
      setOrderParams,
      getOrderParams,
    ],
  );

  return {
    emitFlowEvent,
    status,
  };
};

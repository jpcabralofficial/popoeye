import { NativeEventEmitter } from 'react-native';

import { registerEvents, unregisterEvents } from 'serino-pos-kotlin-bridge';

export enum EventName {
  OnConnect = 'onConnect',
  OnConnectError = 'onConnectError',
  OnDisconnect = 'onDisconnect',
  CreateOrder = 'createOrder',
  UpdateOrderItems = 'updateOrderItems',
  UpdatePaymentDetails = 'updatePaymentDetails',
  UpdateStatus = 'updateStatus',
  UpdateTableStatus = 'updateTableStatus',
  UpdateProductDetails = 'updateProductDetails',
  UpdateOrderAcceptanceStatus = 'updateOrderAcceptanceStatus',
  UpdateCustomerInfo = 'updateCustomerInfo',
  OnScannerRead = 'onScannerRead',
  StartPayment = 'startPayment',
  UpdatePaymentStatus = 'updatePaymentStatus',
}

type CallbackFunction = (event: { data: any }) => void;
type EventCallbacks = Partial<Record<EventName, CallbackFunction>>;

export const srnKotlinSetEventHandlers = async (callbacks: EventCallbacks) => {
  const emitter = new NativeEventEmitter();
  await unregisterEvents();

  for (const eventName in callbacks) {
    const callback = callbacks[eventName as EventName];
    if (callback != null) {
      emitter.addListener(eventName, async event => {
        const data = JSON.parse(event.data);
        callback({ data });
      });
    }
  }

  await registerEvents();
};

import { useEffect, useMemo } from 'react';

import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { incrementQueueTicket } from '../../common/redux/slices/checkout/checkout';
import {
  FLOW_EVENT_PRINT,
  FLOW_EVENT_PRINT_CASHLESS,
  useFlow,
} from '../../context/flow';

const useViewModel = () => {
  const dispatch = useDispatch();

  const { emitFlowEvent } = useFlow();

  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);

  const typeOfPayment = checkoutRedux.typeOfPayment;

  const footerText =
    typeOfPayment === 'cash'
      ? 'Please take your order number below and pay at the cashier'
      : 'Please take your order number below';

  const cashMappedItems = useMemo(() => {
    const items = _.map(cartRedux.cartItems, item => {
      return {
        quantity: item.quantity,
        name: item.name,
      };
    });

    return items;
  }, [cartRedux.cartItems]);

  const cashlessMappedItems = useMemo(() => {
    const items = _.map(cartRedux.cartItems, item => {
      return {
        sku: item.sku,
        quantity: item.quantity,
        instructions: '',
      };
    });

    return items;
  }, [cartRedux.cartItems]);

  // increment redux ticket
  useEffect(() => {
    dispatch(incrementQueueTicket());
  }, [dispatch]);

  // CASH
  useEffect(() => {
    if (checkoutRedux.typeOfPayment === 'cash') {
      const timeout = setTimeout(() => {
        emitFlowEvent(FLOW_EVENT_PRINT, {
          queueNumber: checkoutRedux.counterQueueTicket,
          items: cashMappedItems,
          fulfillmentType:
            checkoutRedux.fulfillmentType === 'dine-in'
              ? 'Dine In'
              : 'Take Out',
        });
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [
    emitFlowEvent,
    cashMappedItems,
    checkoutRedux.counterQueueTicket,
    checkoutRedux.fulfillmentType,
    checkoutRedux.typeOfPayment,
  ]);

  // CASHLESS
  useEffect(() => {
    if (checkoutRedux.typeOfPayment === 'cashless') {
      emitFlowEvent(FLOW_EVENT_PRINT_CASHLESS, {
        skuList: cashlessMappedItems,
        fulfillmentType:
          checkoutRedux.fulfillmentType === 'dine-in' ? 'DINE IN' : 'TAKE OUT',
        queueNumber: checkoutRedux.counterQueueTicket,
      });
    }
  }, [
    emitFlowEvent,
    cashlessMappedItems,
    checkoutRedux.counterQueueTicket,
    checkoutRedux.fulfillmentType,
    checkoutRedux.typeOfPayment,
  ]);

  return {
    footerText,
    orderNumber: checkoutRedux.counterQueueTicket,
  };
};

export default useViewModel;

import { useEffect } from 'react';

import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { clearMembershipBarcode } from '../../common/redux/slices/membership/membership';
import { clearCart } from '../../common/redux/slices/cart/cart';
import {
  clearModeOfPayment,
  clearPaymentStatus,
  incrementQueueTicket,
} from '../../common/redux/slices/checkout/checkout';
import {
  FLOW_EVENT_PRINT,
  FLOW_EVENT_PRINT_CASHLESS,
  useFlow,
} from '../../context/flow';
import { mappedVariants } from '../../common/helpers/common';

const useViewModel = () => {
  const dispatch = useDispatch();

  const { emitFlowEvent } = useFlow();

  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);

  const typeOfPayment = checkoutRedux.typeOfPayment;

  const footerText =
    typeOfPayment === 'cash'
      ? 'Please take your order number and pay at the counter'
      : 'Please take your order number and receipt below';

  // increment redux ticket
  useEffect(() => {
    dispatch(incrementQueueTicket());
    dispatch(clearMembershipBarcode());
    dispatch(clearCart());
    dispatch(clearPaymentStatus());
    dispatch(clearModeOfPayment());
  }, [dispatch]);

  // CASH
  useEffect(() => {
    if (checkoutRedux.typeOfPayment === 'cash') {
      const items = _.map(cartRedux.cartItems, item => {
        const variants = mappedVariants(item?.selectedVariants as any);

        return {
          sku: item.sku,
          quantity: item.quantity,
          instructions: '',
          name: item.name,
          variants: variants,
        };
      });

      emitFlowEvent(FLOW_EVENT_PRINT, {
        skuList: items,
        queueNumber: checkoutRedux.counterQueueTicket + 1,
        fulfillmentType:
          checkoutRedux.fulfillmentType === 'dine-in' ? 'Dine In' : 'Take Out',
      });
    }
  }, [emitFlowEvent]);

  // CASHLESS
  useEffect(() => {
    if (checkoutRedux.typeOfPayment === 'cashless') {
      const items = _.map(cartRedux.cartItems, item => {
        const variants = mappedVariants(item?.selectedVariants as any);

        return {
          sku: item.sku,
          quantity: item.quantity,
          instructions: '',
          name: item.name,
          variants: variants,
        };
      });

      emitFlowEvent(FLOW_EVENT_PRINT_CASHLESS, {
        queueNumber: checkoutRedux.counterQueueTicket + 1,
        skuList: items,
        fulfillmentType:
          checkoutRedux.fulfillmentType === 'dine-in' ? 'Dine In' : 'Take Out',
      });
    }
  }, [emitFlowEvent]);

  return {
    footerText,
    orderNumber: checkoutRedux.counterQueueTicket,
  };
};

export default useViewModel;

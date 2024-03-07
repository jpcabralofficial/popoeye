import { useEffect } from 'react';

import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { incrementQueueTicket } from '../../common/redux/slices/checkout/checkout';
import { FLOW_EVENT_PRINT, useFlow } from '../../context/flow';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const { emitFlowEvent } = useFlow();

  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);

  const typeOfPayment = checkoutRedux.typeOfPayment;

  const footerText =
    typeOfPayment === 'cash'
      ? 'Please take your order number below and pay at the cashier'
      : 'Please take your order number below';

  useEffect(() => {
    dispatch(incrementQueueTicket());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const mappedItems = _.map(cartRedux.cartItems, item => {
        return {
          quantity: item.quantity,
          name: item.name,
        };
      });

      emitFlowEvent(FLOW_EVENT_PRINT, {
        queueNumber: checkoutRedux.counterQueueTicket,
        items: mappedItems,
        fulfillmentType:
          checkoutRedux.fulfillmentType === 'dine-in' ? 'Dine In' : 'Take Out',
      });
    }, 3000);

    // Clear timeout on component unmount to avoid memory leaks
    return () => {
      clearTimeout(timeout);
    };
  }, [
    navigate,
    dispatch,
    emitFlowEvent,
    checkoutRedux.fulfillmentType,
    checkoutRedux.counterQueueTicket,
    cartRedux.cartItems,
  ]); // Empty dependency array ensures the effect runs only once after mount

  return {
    footerText,
    orderNumber: checkoutRedux.counterQueueTicket,
  };
};

export default useViewModel;

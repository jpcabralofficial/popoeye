import { useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { ORDER_SUCCESSFUL } from '../../utils/navigation';

import { useFlow, FLOW_EVENT_PAY_VIA_TPAI } from '../../context/flow';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);

  const { emitFlowEvent } = useFlow();

  const cartTotal = useMemo(
    () => cartRedux.cartItems.reduce((total, item) => total + item.amount, 0),
    [cartRedux.cartItems],
  );

  const modeOfPayment = checkoutRedux.modeOfPayment;

  useEffect(() => {
    emitFlowEvent(FLOW_EVENT_PAY_VIA_TPAI, {
      uuid: 'zxcxzczxcxz', // TODO: use uuidv4 for uuid prop
      amount: cartTotal,
      tax: 0,
      tip: 0,
    });

    // FOR CARD PAYMENT EVENT
    // emitFlowEvent(FLOW_EVENT_CARD_PAYMENT, {
    //   uuid: 'zxczxcxz',
    //   approvalCode: '',
    // });
  }, [emitFlowEvent]);

  useEffect(() => {
    console.log(checkoutRedux.paymentStatus, 'nice');
    if (checkoutRedux.paymentStatus === 'SUCCESSFUL') {
      navigate(ORDER_SUCCESSFUL);
    }
  }, [navigate, checkoutRedux.paymentStatus]);

  return { modeOfPayment: modeOfPayment };
};

export default useViewModel;
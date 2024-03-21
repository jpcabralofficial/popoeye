import { useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { ORDER_SUCCESSFUL } from '../../utils/navigation';

import { useFlow, FLOW_EVENT_PAY_VIA_TPAI } from '../../context/flow';
import _ from 'lodash';
import { mappedVariants } from '../../common/helpers/common';

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

    emitFlowEvent(FLOW_EVENT_PAY_VIA_TPAI, {
      skuList: items,
      amount: cartTotal,
      tax: 0,
      tip: 0,
    });
  }, [emitFlowEvent]);

  useEffect(() => {
    console.log(checkoutRedux.paymentStatus, 'nice');
    if (checkoutRedux.paymentStatus === 'SUCCESSFUL') {
      // FOR CARD PAYMENT EVENT
      // emitFlowEvent(FLOW_EVENT_CARD_PAYMENT, {
      //   uuid: 'zxczxcxz',
      //   approvalCode: '',
      // });

      navigate(ORDER_SUCCESSFUL);
    }
  }, [navigate, checkoutRedux.paymentStatus]);

  return { modeOfPayment: modeOfPayment };
};

export default useViewModel;

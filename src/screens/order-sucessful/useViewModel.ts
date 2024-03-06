import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { clearCart } from '../../common/redux/slices/cart/cart';
import { ONBOARDING_NAV } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);

  console.log(cartRedux.cartItems);

  const typeOfPayment = checkoutRedux.typeOfPayment;

  const footerText =
    typeOfPayment === 'cash'
      ? 'Please take your order number below and pay at the cashier'
      : 'Please take your order number below';

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(clearCart());

      navigate(ONBOARDING_NAV);
    }, 3000);

    // Clear timeout on component unmount to avoid memory leaks
    return () => {
      dispatch(clearCart());
      clearTimeout(timeout);
    };
  }, [navigate, dispatch]); // Empty dependency array ensures the effect runs only once after mount

  const handleNavigatePress = () => {
    dispatch(clearCart());
    navigate(ONBOARDING_NAV);
  };

  return {
    footerText,

    handleNavigatePress,
  };
};

export default useViewModel;

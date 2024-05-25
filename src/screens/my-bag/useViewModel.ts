import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  removeItem,
  setAddQuantity,
  setRemoveQuantity,
} from '../../common/redux/slices/cart/cart';
import { setFulfillmentType } from '../../common/redux/slices/checkout/checkout';
import { cartSelector, checkoutSelector } from '../../common/redux/selector';
import { TYPE_OF_PAYMENT } from '../../utils/navigation';
import { useState } from 'react';
import { CartProductType } from '../../utils/types';

const useViewModel = () => {
  const { navigate, goBack } = useNavigation<any>();
  const dispatch = useDispatch();

  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);

  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    CartProductType | undefined
  >();

  const cartItems = cartRedux.cartItems;
  const cartCount = cartRedux.cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const cartTotal = cartRedux.cartItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const fulfillmentType =
    checkoutRedux.fulfillmentType === 'dine-in' ? 'Dine In' : 'Take Out';

  const handleAddQuantity = (id: string) => {
    dispatch(setAddQuantity(id));
  };

  const handleRemoveQuantity = (id: string) => {
    dispatch(setRemoveQuantity(id));
  };

  const handleRemoveItemPress = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleCustomizePress = (item: CartProductType) => {
    console.log('customize');
    setShowCustomizeModal(true);
    setSelectedItem(item);
  };

  const handleCloseCustomizeModal = () => {
    setShowCustomizeModal(false);
    setSelectedItem({
      quantity: 0,
      amount: 0,
      selectedVariants: [{}],
    });
  };

  const handleChangeFulfillmentPress = (
    fulfillmentType: 'dine-in' | 'take-out',
  ) => {
    dispatch(setFulfillmentType(fulfillmentType));
  };

  const handleNavigatePress = (screen: 'payment' | 'go-back') => {
    if (screen === 'payment') {
      navigate(TYPE_OF_PAYMENT);
    } else if (screen === 'go-back') {
      goBack();
    }
  };

  return {
    cartItems,
    cartCount,
    cartTotal,

    fulfillmentType,
    isDineIn: fulfillmentType === 'Dine In',
    isTakeOut: fulfillmentType === 'Take Out',

    selectedItem,
    showCustomizeModal,
    handleCloseCustomizeModal,

    handleAddQuantity,
    handleRemoveQuantity,
    handleRemoveItemPress,
    handleCustomizePress,

    handleChangeFulfillmentPress,
    handleNavigatePress,
  };
};

export default useViewModel;

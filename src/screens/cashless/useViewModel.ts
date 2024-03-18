import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { setModeOfPayment } from '../../common/redux/slices/checkout/checkout';
import { INSTRUCTION_PAYMENT } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();

  const dispatch = useDispatch();

  const handleCardPress = (payment: 'gcash' | 'maya') => {
    dispatch(setModeOfPayment(payment));
    navigate(INSTRUCTION_PAYMENT);
  };

  return {
    handleCardPress,
  };
};

export default useViewModel;

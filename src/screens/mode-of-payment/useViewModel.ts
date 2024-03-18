import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { setModeOfPayment } from '../../common/redux/slices/checkout/checkout';
import { CASHLESS_PAYMENT, INSTRUCTION_PAYMENT } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const handleCardPress = (mode: 'card' | 'e-wallet') => {
    if (mode === 'card') {
      dispatch(setModeOfPayment('card'));
      navigate(INSTRUCTION_PAYMENT);
    } else {
      navigate(CASHLESS_PAYMENT);
    }
  };

  return {
    handleCardPress,
  };
};

export default useViewModel;

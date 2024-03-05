import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { setTypeOfPayment } from '../../common/redux/slices/checkout/checkout';
import { MODE_OF_PAYMENT, ORDER_SUCCESSFUL } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const handleCardPress = (type: 'cash' | 'cashless') => {
    dispatch(setTypeOfPayment(type));

    if (type === 'cash') {
      navigate(ORDER_SUCCESSFUL);
    } else {
      navigate(MODE_OF_PAYMENT);
    }
  };

  return {
    handleCardPress,
  };
};

export default useViewModel;

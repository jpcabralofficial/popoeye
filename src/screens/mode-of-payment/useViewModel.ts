import { useNavigation } from '@react-navigation/native';

import { CASHLESS_PAYMENT, INSTRUCTION_PAYMENT } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();

  const handleCardPress = (mode: 'card' | 'e-wallet') => {
    if (mode === 'card') {
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

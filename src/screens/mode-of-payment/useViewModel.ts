import {useNavigation} from '@react-navigation/native';

import {CASHLESS_PAYMENT} from '../../utils/navigation';

const useViewModel = () => {
  const {navigate} = useNavigation<any>();

  const handleCardPress = (mode: 'card' | 'e-wallet') => {
    if (mode === 'card') {
      console.log(mode);
    } else {
      navigate(CASHLESS_PAYMENT);
    }
  };

  return {
    handleCardPress,
  };
};

export default useViewModel;

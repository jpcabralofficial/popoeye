import {useNavigation} from '@react-navigation/native';

import {INSTRUCTION_PAYMENT} from '../../utils/navigation';

const useViewModel = () => {
  const {navigate} = useNavigation<any>();

  const handleCardPress = (payment: 'gcash' | 'maya') => {
    navigate(INSTRUCTION_PAYMENT);

    if (payment === 'gcash') {
      console.log(payment);
    } else {
      console.log(payment);
    }
  };

  return {
    handleCardPress,
  };
};

export default useViewModel;

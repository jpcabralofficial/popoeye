import {useNavigation} from '@react-navigation/native';
import {ONBOARDING_NAV} from '../../utils/navigation';
import {useDispatch} from 'react-redux';
import {clearCart} from '../../common/redux/slices/cart/cart';

const useViewModel = () => {
  const {navigate, goBack} = useNavigation<any>();
  const dispatch = useDispatch();

  const handleButtonPress = (answer: 'yes' | 'no') => {
    if (answer === 'yes') {
      dispatch(clearCart());
      navigate(ONBOARDING_NAV);
    } else {
      goBack();
    }
  };

  return {
    handleButtonPress,
  };
};

export default useViewModel;

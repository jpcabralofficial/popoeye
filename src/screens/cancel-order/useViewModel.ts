import { useNavigation } from '@react-navigation/native';
import { ONBOARDING_NAV } from '../../utils/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../common/redux/slices/cart/cart';
import { clearMembershipBarcode } from '../../common/redux/slices/membership/membership';

const useViewModel = () => {
  const { navigate, goBack } = useNavigation<any>();
  const dispatch = useDispatch();

  const handleButtonPress = (answer: 'yes' | 'no') => {
    if (answer === 'yes') {
      dispatch(clearCart());
      dispatch(clearMembershipBarcode());
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

import { useNavigation } from '@react-navigation/native';
import { FULFILLMENT_NAV } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();

  const handleNavigation = () => {
    navigate(FULFILLMENT_NAV);
  };

  return { handleNavigation };
};

export default useViewModel;

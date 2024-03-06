import {useNavigation} from '@react-navigation/native';
import {SCAN_MEMBERSHIP_NAV} from '../../utils/navigation';

const useViewModel = () => {
  const {navigate} = useNavigation<any>();

  const handleNavigation = () => {
    navigate(SCAN_MEMBERSHIP_NAV);
  };

  return {handleNavigation};
};

export default useViewModel;

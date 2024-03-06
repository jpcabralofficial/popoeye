import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { checkoutSelector } from '../../common/redux/selector';
import { ORDER_SUCCESSFUL } from '../../utils/navigation';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const checkoutRedux = useSelector(checkoutSelector);
  console.log(checkoutRedux);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(ORDER_SUCCESSFUL);
    }, 3000);

    // Clear timeout on component unmount to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [navigate]); // Empty dependency array ensures the effect runs only once after mount
};

export default useViewModel;

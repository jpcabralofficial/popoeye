import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import {setFulfillmentType} from '../../common/redux/slices/checkout/checkout';
import {PRODUCT_NAV} from '../../utils/navigation';

type FulfillmentType = 'dine-in' | 'take-out';

const useViewModel = () => {
  const {navigate} = useNavigation<any>();
  const dispatch = useDispatch();

  const handleFulfillmentPress = (fulfillmentType: FulfillmentType) => {
    dispatch(setFulfillmentType(fulfillmentType));
    navigate(PRODUCT_NAV);
  };

  return {handleFulfillmentPress};
};

export default useViewModel;

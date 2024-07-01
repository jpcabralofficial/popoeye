import { Text, View } from 'native-base';
import React from 'react';
import { COLORS } from '../../../utils/colors';

const UpSellHeader = () => {
  return (
    <View
      width={'100%'}
      justifyContent={'center'}
      flexDirection={'row'}
      alignItems={'center'}>
      <Text color={COLORS.primary}>Try these, too!</Text>
    </View>
  );
};

export default React.memo(UpSellHeader);

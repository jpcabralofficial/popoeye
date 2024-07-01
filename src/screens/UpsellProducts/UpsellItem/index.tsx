import { View, Text } from 'react-native';
import React from 'react';
type upsellItem = {
  imgSrc: number | string;
  isBestSeller: boolean;
  product: string;
  price: string;
};
type props = {
  onClick: (val: upsellItem) => any;
  data: upsellItem;
};

const UpsellItems: React.FC<props> = () => {
  return (
    <View>
      <Text>UpsellItems</Text>
    </View>
  );
};

export default React.memo(UpsellItems);

import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import { VariantType } from '../../utils/types';

type VariantCardType = {
  item: VariantType;
  isSelected: boolean;
};

const VariantCard = ({ item, isSelected }: VariantCardType) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.productCardContainer,
        {
          backgroundColor: theme.colors.white,
          borderWidth: 3,
          borderColor: isSelected ? theme.colors.primary : theme.colors?.white,
        },
      ]}>
      <View
        style={{
          justifyContent: 'space-between',
        }}>
        {item?.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.productCardImage}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.productCardName, { color: theme.colors.black }]}>
          {item?.name}
        </Text>

        <Text style={[styles.productCardPrice, { color: theme.colors.black }]}>
          {/* {item?.additional_price} */}
          {/* + {thousandSeparatorWithCurrencySign(item?.additional_price)} */}
          {item?.additional_price !== 0
            ? '+ ' + thousandSeparatorWithCurrencySign(item?.additional_price)
            : null}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCardContainer: {
    alignItems: 'center',
    borderRadius: 20,
    elevation: 4,
    height: 300,
    justifyContent: 'space-between',
    marginRight: 20,
    marginVertical: 10,
    paddingHorizontal: 50,
    paddingVertical: 20,
    width: 190,
  },
  productCardImage: {
    borderRadius: 20,
    height: 150,
    width: 155,
  },
  productCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  productCardPrice: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default VariantCard;

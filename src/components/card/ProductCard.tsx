import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import { ProductType } from '../../utils/types';

type ProductCardType = {
  item: ProductType;
  quantity: number;
  handleAddToCart: (item: ProductType) => void;
  handleAddQuantity: (id: string) => void;
};

const ProductCard = ({
  item,
  quantity,
  handleAddToCart,
  handleAddQuantity,
}: ProductCardType) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() =>
        quantity <= 0 ? handleAddToCart(item) : handleAddQuantity(item.id)
      }
      activeOpacity={1}
      style={[
        styles.productCardContainer,
        { backgroundColor: theme.colors.white },
      ]}>
      <View>
        {quantity > 0 && (
          <View
            style={[
              styles.myBagCountContainer,
              {
                backgroundColor: theme.colors.accent,
                borderColor: theme.colors.white,
              },
            ]}>
            <Text
              style={[styles.myBagCountText, { color: theme.colors.white }]}>
              {quantity}
            </Text>
          </View>
        )}
        <Image
          source={{ uri: item?.images }}
          style={styles.productCardImage}
          resizeMode="contain"
        />
        <Text style={[styles.productCardName, { color: theme.colors.black }]}>
          {item.name}
        </Text>

        <Text style={[styles.productCardPrice, { color: theme.colors.black }]}>
          {thousandSeparatorWithCurrencySign(parseInt(item.price, 10))}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  myBagCountContainer: {
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 3,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: -5,
    width: 50,
    zIndex: 100,
  },
  myBagCountText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productCardContainer: {
    alignItems: 'center',
    borderRadius: 20,
    elevation: 4,
    gap: 14,
    justifyContent: 'space-between',
    marginRight: 10,
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
    textAlign: 'center',
  },
  productCardPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default ProductCard;

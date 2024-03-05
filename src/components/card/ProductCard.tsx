import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';

import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import { ProductType } from '../../utils/types';

type ProductCardType = {
  item: ProductType;
  quantity: number;
  isAlreadyInCart: boolean;
  handleAddToCart: (item: ProductType) => void;
  handleAddQuantity: (id: string) => void;
  handleRemoveQuantity: (id: string) => void;
};

const ProductCard = ({
  item,
  quantity,
  isAlreadyInCart,
  handleAddToCart,
  handleAddQuantity,
  handleRemoveQuantity,
}: ProductCardType) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.productCardContainer,
        { backgroundColor: theme.colors.white },
      ]}>
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

      {!isAlreadyInCart ? (
        <TouchableOpacity
          onPress={() => handleAddToCart(item)}
          style={[
            styles.productCardButton,
            { backgroundColor: theme.colors.accent },
          ]}>
          <Text
            style={[
              styles.productCardButtonLabel,
              { color: theme.colors.white },
            ]}>
            Add to Bag
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityButtonContainer}>
          <TouchableOpacity
            onPress={() => handleRemoveQuantity(item.id)}
            style={[
              styles.quantityButton,
              { backgroundColor: theme.colors.black },
            ]}>
            <AntDesign name="minus" size={20} color={theme.colors.white} />
          </TouchableOpacity>

          <Text
            style={[
              styles.quantityText,
              {
                color: theme.colors.black,
                borderColor: theme.colors.black,
              },
            ]}>
            {quantity}
          </Text>

          <TouchableOpacity
            onPress={() => handleAddQuantity(item.id)}
            style={[
              styles.quantityButton,
              { backgroundColor: theme.colors.accent },
            ]}>
            <AntDesign name="plus" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productCardButton: {
    borderRadius: 10,
    paddingVertical: 8.5,
    width: '170%',
  },
  productCardButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
  quantityButton: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    paddingVertical: 10,
    width: '50%',
  },
  quantityButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
  },
  quantityText: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 22,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});
export default ProductCard;

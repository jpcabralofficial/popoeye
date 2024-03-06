import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import { ProductType } from '../../utils/types';

type CartListCardType = {
  item: ProductType & { quantity: number; amount: number };
  handleAddQuantity: (id: string) => void;
  handleRemoveQuantity: (id: string) => void;
  handleRemoveItemPress: (id: string) => void;
};

const CartListCard = ({
  item,
  handleAddQuantity,
  handleRemoveQuantity,
  handleRemoveItemPress,
}: CartListCardType) => {
  const theme = useTheme();

  return (
    <>
      <View style={styles.itemContainer}>
        {/* quantity */}
        <Text style={[styles.itemText, { color: theme.colors.black }]}>
          x{item.quantity}
        </Text>

        {/* item */}
        <View style={styles.item}>
          <View
            style={[
              styles.itemImageContainer,
              { backgroundColor: theme.colors.white },
            ]}>
            <Image
              source={{ uri: item.images }}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.itemName, { color: theme.colors.black }]}>
            {item.name}
          </Text>
        </View>

        {/* amount */}
        <Text style={[styles.itemText, { color: theme.colors.black }]}>
          {thousandSeparatorWithCurrencySign(item.amount)}
        </Text>

        {/* action */}
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
            {item.quantity}
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
      </View>

      {/* remove button */}
      <TouchableOpacity
        onPress={() => handleRemoveItemPress(item.id)}
        style={styles.removeButton}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color={theme.colors.accent}
        />
        <Text
          style={[styles.removeButtonLabel, { color: theme.colors.accent }]}>
          Remove
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    marginRight: 40,
    width: 120,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 65,
  },
  itemImage: {
    height: 80,
    width: 80,
  },
  itemImageContainer: {
    elevation: 4,
    padding: 10,
  },
  itemName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityButton: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  quantityButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  quantityText: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 22,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  removeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 10,
  },
  removeButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CartListCard;

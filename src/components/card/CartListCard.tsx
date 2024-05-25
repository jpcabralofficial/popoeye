import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  mappedVariants,
  thousandSeparatorWithCurrencySign,
} from '../../common/helpers/common';
import { CartProductType } from '../../utils/types';
import _ from 'lodash';

type CartListCardType = {
  item: CartProductType;
  handleAddQuantity: (id: string) => void;
  handleRemoveQuantity: (id: string) => void;
  handleRemoveItemPress: (id: string) => void;
  handleCustomizePress: (item: CartProductType) => void;
};

const CartListCard = ({
  item,
  handleAddQuantity,
  handleRemoveQuantity,
  handleRemoveItemPress,
  handleCustomizePress,
}: CartListCardType) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  let variants;
  if (item?.selectedVariants) {
    variants = mappedVariants(item.selectedVariants);
  }

  return (
    <>
      <View style={styles.itemContainer}>
        {/* quantity */}
        <View style={{ width: width / 4 - 100 }}>
          <Text style={[styles.itemText, { color: theme.colors.black }]}>
            x{item.quantity}
          </Text>
        </View>

        {/* item */}
        <View style={[styles.item, { width: width / 4 + 50 }]}>
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

          <View style={{ alignItems: 'flex-start', gap: 15 }}>
            <Text style={[styles.itemName, { color: theme.colors.black }]}>
              {item.name}
            </Text>

            {variants && (
              <>
                <View style={{ paddingLeft: 10, width: 120, gap: 3, flex: 1 }}>
                  {_.map(variants, item => {
                    return (
                      <View key={item.name}>
                        <Text
                          style={{
                            color: theme.colors.gray70,
                            fontWeight: 'bold',
                          }}>
                          {item.quantity} {item.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <TouchableOpacity
                  onPress={() => handleCustomizePress(item)}
                  style={{ paddingHorizontal: 10 }}>
                  <Text
                    style={{
                      color: theme.colors.accent,
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Customize
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* amount */}
        <Text style={[styles.itemText, { color: theme.colors.black, flex: 1 }]}>
          {thousandSeparatorWithCurrencySign(item.amount)}
        </Text>

        {/* action */}
        <View style={{}}>
          <View style={styles.quantityButtonContainer}>
            <TouchableOpacity
              onPress={() => handleRemoveQuantity(item.id)}
              style={[
                styles.quantityButton,
                {
                  backgroundColor: theme.colors.white,
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                },
              ]}>
              <AntDesign name="minus" size={20} color={theme.colors.primary} />
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
                { backgroundColor: theme.colors.primary },
              ]}>
              <AntDesign name="plus" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          {/* remove button */}
          <TouchableOpacity
            onPress={() => handleRemoveItemPress(item.id)}
            style={styles.removeButton}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color={theme.colors.gray80}
            />
            <Text
              style={[
                styles.removeButtonLabel,
                { color: theme.colors.gray80 },
              ]}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
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
    width: 120,
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
    paddingTop: 20,
  },
  quantityText: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  removeButton: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 50,
  },
  removeButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CartListCard;

import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';

import CartListHeader from '../../components/custom/CartListHeader';
import CartListCard from '../../components/card/CartListCard';
import CommonButton from '../../components/button/CommonButton';

import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const MyBagScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const {
    cartItems,
    cartCount,
    cartTotal,

    fulfillmentType,
    isDineIn,
    isTakeOut,

    handleAddQuantity,
    handleRemoveQuantity,
    handleRemoveItemPress,

    handleChangeFulfillmentPress,
    handleNavigatePress,
  } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* header */}
      <View style={styles.headerContainer}>
        <Image
          source={IMAGES.LANDERS_CENTRAL_LOGO}
          style={styles.landersCentralLogo}
          resizeMode="stretch"
        />

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
            My Bag
          </Text>
        </View>
      </View>

      {/* separator */}
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.accent, width: width },
        ]}
      />

      {/* content */}
      <View style={styles.contentContainer}>
        <View style={[styles.content, { backgroundColor: theme.colors.white }]}>
          {/* content header */}
          <View style={styles.contentHeaderContainer}>
            <View style={styles.contentHeaderLeft}>
              <TouchableOpacity
                onPress={() => handleNavigatePress('go-back')}
                style={[
                  styles.backButton,
                  { borderColor: theme.colors.black },
                ]}>
                <AntDesign
                  name="arrowleft"
                  size={40}
                  color={theme.colors.black}
                />
              </TouchableOpacity>

              {cartCount > 0 && (
                <Text style={[styles.cartCount, { color: theme.colors.black }]}>
                  {cartCount} Items
                </Text>
              )}
            </View>

            <View style={styles.contentHeaderRight}>
              <TouchableOpacity
                onPress={() => handleChangeFulfillmentPress('dine-in')}
                activeOpacity={1}
                style={[
                  isDineIn
                    ? styles.activeFulfillmentButton
                    : styles.inactiveFulfillmentButton,
                  {
                    backgroundColor: isDineIn
                      ? theme.colors.accent
                      : theme.colors.white,
                    borderColor: theme.colors.lightBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.fulfillmentButtonLabel,
                    {
                      color: isDineIn ? theme.colors.white : theme.colors.black,
                    },
                  ]}>
                  Dine In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleChangeFulfillmentPress('take-out')}
                activeOpacity={1}
                style={[
                  isTakeOut
                    ? styles.activeFulfillmentButton
                    : styles.inactiveFulfillmentButton,
                  {
                    backgroundColor: isTakeOut
                      ? theme.colors.accent
                      : theme.colors.white,
                    borderColor: theme.colors.lightBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.fulfillmentButtonLabel,
                    {
                      color: isTakeOut
                        ? theme.colors.white
                        : theme.colors.black,
                    },
                  ]}>
                  Take Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* cart list header */}
          <CartListHeader />

          {/* list of cart items */}
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <CartListCard
                  item={item}
                  handleAddQuantity={handleAddQuantity}
                  handleRemoveQuantity={handleRemoveQuantity}
                  handleRemoveItemPress={handleRemoveItemPress}
                />
              );
            }}
          />
        </View>
      </View>

      {/* separator */}
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.accent, width: width },
        ]}
      />

      {/* footer */}
      <View
        style={[
          styles.footerContainer,
          { backgroundColor: theme.colors.white },
        ]}>
        <View style={styles.footerLabelContainer}>
          <Text style={[styles.footerLabel, { color: theme.colors.black }]}>
            {fulfillmentType}
          </Text>
          <Text style={[styles.footerLabel, { color: theme.colors.black }]}>
            Total Order: {thousandSeparatorWithCurrencySign(cartTotal)}
          </Text>
        </View>

        <View style={styles.footerButtonContainer}>
          <CommonButton
            label="Proceed to Payment"
            onPress={() => handleNavigatePress('payment')}
            disabled={cartCount === 0}
            backgroundColor={
              cartCount === 0 ? theme.colors.disabled : theme.colors.accent
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeFulfillmentButton: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    paddingVertical: 7,
    width: 150,
  },
  backButton: {
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  cartCount: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    paddingHorizontal: 30,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  contentHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
    marginLeft: 20,
    marginVertical: 50,
  },
  contentHeaderRight: {
    flexDirection: 'row',
    gap: 20,
  },
  footerButtonContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  footerContainer: {
    gap: 20,
    paddingVertical: 20,
  },
  footerLabel: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  footerLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  fulfillmentButtonLabel: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerContainer: {
    gap: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 70,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  inactiveFulfillmentButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    paddingVertical: 7,
    width: 150,
  },
  landersCentralLogo: {
    alignSelf: 'center',
    height: 100,
    width: 130,
  },
  listContainer: {
    gap: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  separator: {
    height: 7,
  },
});

export default MyBagScreen;

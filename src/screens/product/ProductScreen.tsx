import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  View,
  useWindowDimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import ProductContentTitle from '../../components/custom/ProductContentTitle';
import ProductCard from '../../components/card/ProductCard';
import CategoryCard from '../../components/card/CategoryCard';
import CommonButton from '../../components/button/CommonButton';

import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const ProductScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const numberOfProductColumns = 3;

  const {
    activeCategories,
    activeProducts,

    selectedCategory,
    selectedCategoryIndex,

    fulfillmentType,
    cartCount,
    cartTotal,

    getProductId,

    handleCategoryPress,

    handleAddToCart,
    handleAddQuantity,

    handleButtonPress,
    handleNavigatePress,
  } = useViewModel();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* header */}
      <View style={styles.headerContainer}>
        <Image
          source={IMAGES.LANDERS_CENTRAL_LOGO}
          style={styles.headerLogo}
          resizeMode="stretch"
        />

        {/* header content */}
        <View style={styles.headerContentContainer}>
          {/* header title  */}
          <Text style={[styles.headerTitleText, { color: theme.colors.white }]}>
            What are you craving for?
          </Text>

          {/* my bag */}
          <TouchableOpacity onPress={handleNavigatePress} activeOpacity={0.8}>
            {cartCount > 0 && (
              <View
                style={[
                  styles.myBagCountContainer,
                  { backgroundColor: theme.colors.accent },
                ]}>
                <Text
                  style={[
                    styles.myBagCountText,
                    { color: theme.colors.white },
                  ]}>
                  {cartCount}
                </Text>
              </View>
            )}

            <Image
              source={IMAGES.SHOPPING_BAG_ICON}
              style={styles.myBagIcon}
              resizeMode="stretch"
            />

            <Text style={[styles.myBagLabel, { color: theme.colors.white }]}>
              My Bag
            </Text>
          </TouchableOpacity>
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
        {/* scrollable categories */}
        <View>
          <FlatList
            data={activeCategories}
            keyExtractor={category => category.name}
            contentContainerStyle={styles.scrollableCategoriesContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const selected = index === selectedCategoryIndex;

              return (
                <CategoryCard
                  item={item}
                  index={index}
                  selected={selected}
                  handleCategoryPress={handleCategoryPress}
                />
              );
            }}
          />
        </View>

        {/* list of products */}
        <View
          style={[
            styles.productContentContainer,
            { backgroundColor: theme.colors.white },
          ]}>
          <Image
            source={IMAGES.LANDERS_CENTRAL_BANNER}
            style={styles.headerBannerImage}
          />

          <FlatList
            data={activeProducts}
            keyExtractor={item => item?.id}
            numColumns={numberOfProductColumns}
            contentContainerStyle={styles.productContent}
            ListHeaderComponent={
              <ProductContentTitle selectedCategory={selectedCategory} />
            }
            renderItem={({ item }) => {
              const product = getProductId(item.id);

              let quantity;

              if (product) {
                quantity = product.quantity;
              } else {
                quantity = 0;
              }

              return (
                <ProductCard
                  item={item}
                  quantity={quantity}
                  handleAddToCart={handleAddToCart}
                  handleAddQuantity={handleAddQuantity}
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
            label="Cancel Order"
            backgroundColor={theme.colors.black}
            size="half"
            onPress={() => handleButtonPress('cancel')}
          />

          <CommonButton
            label="Review Order and Pay"
            size="half"
            disabled={cartCount === 0}
            backgroundColor={
              cartCount === 0 ? theme.colors.disabled : theme.colors.accent
            }
            onPress={() => handleButtonPress('pay')}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  headerBannerImage: {
    width: '100%',
  },
  headerContainer: {
    gap: 20,
    paddingVertical: 20,
  },
  headerContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  headerLogo: {
    alignSelf: 'center',
    height: 100,
    width: 130,
  },
  headerTitleText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  myBagCountContainer: {
    alignItems: 'center',
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: -20,
    width: 50,
    zIndex: 100,
  },
  myBagCountText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  myBagIcon: {
    alignSelf: 'center',
    height: 70,
    width: 70,
  },
  myBagLabel: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  productContent: {
    gap: 30,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  productContentContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  scrollableCategoriesContainer: {
    alignItems: 'center',
    gap: 10,
    paddingRight: 30,
  },
  separator: {
    height: 7,
  },
});

export default ProductScreen;

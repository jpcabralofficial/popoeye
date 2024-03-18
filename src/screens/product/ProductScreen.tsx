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
  ImageBackground,
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
    handleRemoveQuantity,

    handleButtonPress,
    handleNavigatePress,
  } = useViewModel();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* header */}
      <View style={styles.headerContainer}>
        <Image
          source={IMAGES.POPEYES_LOGO_TEXT}
          style={styles.headerLogo}
          resizeMode="stretch"
        />

         {/* my bag */}
          <TouchableOpacity style={[styles.cartCont, { borderColor: theme.colors.buttoncolor }]} onPress={handleNavigatePress} activeOpacity={0.8}>
           <ImageBackground source={IMAGES.CART_CONTAINER} 
            style={{ height: 125, width: 125,
              justifyContent: 'center',
               alignItems: 'center',
               alignSelf: 'center',
           }}>
            {cartCount > 0 && (
                <View
                  style={[
                    styles.myBagCountContainer,
                    { backgroundColor: theme.colors.accent, borderColor: theme.colors.white},
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
           </ImageBackground>
          </TouchableOpacity>
          
      
        
        </View>

      {/* separator */}
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.white, width: width },
        ]}
      />

      {/* content */}
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.buttoncolor}]}>
        {/* scrollable categories */}
        <Image
          source={IMAGES.BACKGROUND_IMAGE}
          style={{ height: "100%", width: width, zIndex: -1, position: "absolute"}}
          resizeMode="stretch"
        />
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
            source={IMAGES.POPEYES_BANNER}
            style={styles.headerBannerImage}
            resizeMode='stretch'
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
              const isAlreadyInCart = !!product;

              let quantity;

              if (product) {
                quantity = product.quantity;
              } else {
                quantity = 0;
              }

              return (
                <ProductCard
                  item={item}
                  isAlreadyInCart={isAlreadyInCart}
                  quantity={quantity}
                  handleAddToCart={handleAddToCart}
                  handleAddQuantity={handleAddQuantity}
                  handleRemoveQuantity={handleRemoveQuantity}
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
          { backgroundColor: theme.colors.primary, width: width },
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
            labelColor={theme.colors.primary}
            label="Cancel Order"
            backgroundColor={theme.colors.buttoncolor}
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
  cartCont:{
    borderRadius: 100,
    borderWidth: 4,
    height: 150,
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
    top: 20,
    width: 150,
  },
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
    width: '101%',
  },
  headerContainer: {
    gap: 20,
    paddingVertical: 30,
  },
  headerLogo: {
    alignSelf: 'center',
    height: 115,
    width: 345,
  },
  myBagCountContainer: {
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 3,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    top: -5,
    width: 50,
    zIndex: 100,
  },
  myBagCountText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  myBagIcon: {
    alignSelf: 'center',
    height: 47,
    width: 59,
  },
  myBagLabel: {
    fontSize: 24,
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

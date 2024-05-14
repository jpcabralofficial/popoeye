import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ProductType, VariantType } from '../../utils/types';
import { thousandSeparatorWithCurrencySign } from '../../common/helpers/common';
import _ from 'lodash';
import VariantCard from '../card/VariantCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAddQuantity,
  setAddToCart,
} from '../../common/redux/slices/cart/cart';
import { cartSelector } from '../../common/redux/selector';
import { IMAGES } from '../../utils/images';

type Props = {
  isVisible: boolean;
  onModalHide?: () => void;
  item?: ProductType;
};

const VariantsModal = ({ isVisible, onModalHide, item }: Props) => {
  // console.log(item?.sku);
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();
  const flatlistRef = useRef([]);

  const cartRedux = useSelector(cartSelector);
  const [curentIndex, setCurentIndex] = useState([0, 0, 0, 0]);

  const [selectedVariants, setSelectedVariants] =
    useState<Array<VariantType & { title: string }>>();

  const [selectedSizes, setSelectedSizes] = useState<
    (VariantType & { title: string }) | undefined
  >(undefined);

  const [optionSets, setOptionSets] = useState<[]>([]);

  const [totalAmount, setTotalAmount] = useState<number>(parseInt(item?.price));

  const anotherMappedVariants = useMemo(() => {
    return _.map(item?.variants, variant => {
      return {
        title: variant?.name ?? '',
        options: _.map(variant?.option_sets, option => {
          if (variant?.name === 'Drinks') {
            if (option?.options) {
              return {
                optionName: option?.name ?? '',
                options: option?.options ?? [],
                optionSet: option?.option_set ?? [],
              };
            }
          } else {
            if (option?.options) {
              return {
                optionName: option?.name ?? '',
                options: option?.options ?? [],
                optionSet: option?.option_set ?? [],
              };
            }
          }
        }),
      };
    });
  }, [item?.variants]);

  const transformData = (data: { title?: any; options: any }) => {
    const optionsNewData = _.map(data?.options, item => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const { optionName, options, optionSet } = item;
        if (
          options !== null &&
          options.length > 0 &&
          optionSet !== null &&
          optionSet.length > 0
        ) {
          // const optionSetName = _.map(optionSet, set => set?.optionName);
          // console.log(optionSet[0].name, 'option');

          const newOptions = _.map(options, option => ({
            ...option,
            optionSetName: optionSet[0].name,
          }));
          return { optionName, options: newOptions };
        }
      }
      return item;
    }).filter(Boolean);

    const optionSetNewData = _.map(data?.options, item => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const { optionName, optionSet } = item;
        if (optionSet !== null && optionSet.length > 0) {
          return { optionName, optionSet };
        }
      }
      return item;
    }).filter(Boolean);

    const allOptions = optionsNewData.flatMap(item => item?.options);
    const allOptionsSet = optionSetNewData.flatMap(item => item?.optionSet);

    return {
      title: 'Drinks',
      options: [
        {
          optionName: 'Drinks',
          options: allOptions,
          optionSet: allOptionsSet,
        },
      ],
    };
  };

  const handleAddToBag = () => {
    const isItemAlreadyInCart = _.find(
      cartRedux.cartItems,
      cart => cart.sku === item?.sku,
    );

    if (!isItemAlreadyInCart && item?.variants?.length === 0) {
      dispatch(
        setAddToCart({
          ...item,
          quantity: 1,
          amount: parseInt(item.price, 10),
        }),
      );
      onCloseModal();
    } else if (isItemAlreadyInCart && item?.variants?.length === 0) {
      dispatch(setAddQuantity(item.id));
      onCloseModal();
    } else {
      const checkIfDrinksExist = _.find(
        selectedVariants,
        item => item.title === 'Drinks',
      );
      let variants;
      if (checkIfDrinksExist) {
        variants = [...(selectedVariants || []), selectedSizes];
      } else {
        variants = selectedVariants;
      }
      const itemWithVariants = {
        ...item,
        id: item?.id + uuidv4(),
        selectedVariants: variants,
        quantity: 1,
        amount: totalAmount,
      };
      console.log(itemWithVariants, 'items');
      dispatch(setAddToCart(itemWithVariants));
      onCloseModal();
    }

    setCurentIndex([0, 0, 0, 0]);
  };

  const handleCancel = () => {
    onCloseModal();
    setCurentIndex([0, 0, 0, 0]);
  };

  const handleAddToVariants = (item: VariantType, title: string) => {
    const newArray = _.filter(selectedVariants, obj => obj.title !== title);
    newArray.push({ ...item, title: title });

    setSelectedVariants(newArray);
  };

  const handleAddToVariantsSizes = (item: VariantType, title: string) => {
    setSelectedSizes({ ...item, title });
  };

  const onCloseModal = () => {
    setOptionSets([]);
    setSelectedVariants([]);
    setSelectedSizes(undefined);
    onModalHide?.();
    setCurentIndex([0, 0, 0, 0]);
  };

  const isObjectInArray = (obj: VariantType) => {
    const isInVariants = _.find(
      selectedVariants,
      item => item.name === obj.name,
    );

    return !!isInVariants;
  };

  const isVariantObjectInArray = (obj: VariantType) => {
    if (selectedSizes?.name === obj.name) return true;
  };

  useEffect(() => {
    const totalPrice =
      selectedVariants?.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.additional_price,
        0,
      ) ?? 0;

    let totalAmount;

    if (selectedSizes && selectedSizes?.additional_price) {
      totalAmount =
        parseInt(item?.price, 10) +
        totalPrice +
        selectedSizes?.additional_price;
    } else {
      totalAmount = parseInt(item?.price, 10) + totalPrice;
    }

    setTotalAmount(totalAmount);
  }, [selectedSizes, selectedVariants, item]);

  useEffect(() => {
    const result = _.flatMap(anotherMappedVariants, item => {
      return {
        ...item?.options?.[0],
        title: item?.title,
      };
    });
    const result2 = _.flatMap(result, item => {
      return {
        ...item?.options?.[0],
        title: item?.title,
      };
    });

    setSelectedVariants(result2);
    setSelectedSizes({
      name: 'Regular',
      title: 'Sizes',
      additional_price: 0,
      status: true,
      image: '',
    });
  }, [anotherMappedVariants, item]);

  const onScrollRight = (index: number, length: number) => {
    if (curentIndex[index] < length - 1) {
      const newArray = [...curentIndex];
      newArray[index] = newArray[index] + 1;
      flatlistRef.current[index]?.scrollToIndex({
        index: newArray[index],
      });
      setCurentIndex(newArray);
    } else {
      const newArray = [...curentIndex];
      newArray[index] = length - 1;

      setCurentIndex(newArray);
    }
  };

  const onScrollLeft = (index: number, length: number) => {
    if (curentIndex[index] > 0) {
      const newArray = [...curentIndex];
      newArray[index] = newArray[index] - 1;
      flatlistRef.current[index]?.scrollToIndex({
        index: newArray[index],
      });
      setCurentIndex(newArray);
    } else if (curentIndex[index] === 0) {
      const newArray = [...curentIndex];
      newArray[index] = 0;
      flatlistRef.current[index]?.scrollToIndex({
        index: newArray[index],
      });
      setCurentIndex(newArray);
    }
  };
  return (
    <Modal
      isVisible={isVisible}
      style={styles.container}
      onModalHide={onCloseModal}>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors?.white,
            width: width - 120,
            height: item?.variants?.length === 0 ? 400 : height / 2 + 350,
          },
        ]}>
        {/* close button */}
        <TouchableOpacity
          onPress={onModalHide}
          style={{
            alignSelf: 'flex-end',
            paddingHorizontal: 40,
            paddingTop: 20,
          }}>
          <MaterialCommunityIcons
            name="close"
            size={50}
            color={theme.colors.gray70}
          />
        </TouchableOpacity>

        {/* header */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 50,
            gap: 10,
            marginBottom: 20,
          }}>
          <View style={{ width: 250, height: 120 }}>
            {item?.image_thumbnail && (
              <Image
                source={{ uri: item?.image_thumbnail }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={{ justifyContent: 'space-between' }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.colors.black,
                width: '70%',
              }}>
              {item?.name}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.colors.black,
              }}>
              {thousandSeparatorWithCurrencySign(totalAmount)}
            </Text>
          </View>
        </View>

        {/* content */}
        <View style={{ backgroundColor: '#f5f5f5', flex: 1, borderRadius: 50 }}>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingHorizontal: 40,
            }}>
            {item?.variants?.length !== 0 && (
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: theme.colors.black,
                  width: '70%',
                }}>
                Variants
              </Text>
            )}

            <View style={{ paddingVertical: 20 }}>
              {_.map(anotherMappedVariants, (variants, index) => {
                let data;

                if (variants.title === 'Drinks') {
                  data = transformData(variants);
                } else {
                  data = variants;
                }

                return (
                  <View key={variants.title} style={{ paddingVertical: 10 }}>
                    <Text
                      style={{
                        color: theme.colors.black,
                        fontSize: 24,
                        fontWeight: 'bold',
                      }}>
                      Select {variants.title}
                    </Text>

                    {_.map(data?.options, option => {
                      return (
                        <>
                          {option?.options.length > 4 ? (
                            <>
                              {curentIndex[index] === 0 ? null : (
                                <TouchableOpacity
                                  delayPressIn={0}
                                  style={{ zIndex: 1 }}
                                  onPress={() =>
                                    onScrollLeft(index, option?.options.length)
                                  }>
                                  <Image
                                    source={IMAGES.ARROW_LEFT}
                                    style={{
                                      height: 55,
                                      width: 55,
                                      left: -20,
                                      position: 'absolute',
                                      top: 80,
                                    }}
                                    resizeMode="contain"
                                  />
                                </TouchableOpacity>
                              )}

                              {curentIndex[index] ===
                              option?.options.length - 4 ? null : (
                                <TouchableOpacity
                                  delayPressIn={0}
                                  style={{ zIndex: 999 }}
                                  onPress={() =>
                                    onScrollRight(index, option?.options.length)
                                  }>
                                  <Image
                                    source={IMAGES.ARROW_RIGHT}
                                    style={{
                                      height: 55,
                                      width: 55,
                                      right: -10,
                                      position: 'absolute',
                                      top: 80,
                                    }}
                                    resizeMode="contain"
                                  />
                                </TouchableOpacity>
                              )}
                            </>
                          ) : null}
                          <FlatList
                            ref={
                              option?.options.length > 4
                                ? ref => (flatlistRef.current[index] = ref) // Assign ref to the corresponding index
                                : null
                            }
                            data={option?.options}
                            keyExtractor={(item, itemIndex) =>
                              `${item.name}-${itemIndex}`
                            }
                            horizontal
                            bounces={false}
                            onMomentumScrollEnd={event => {
                              const indexCur = Math.floor(
                                event.nativeEvent.contentOffset.x / 160,
                              );

                              const newArray = [...curentIndex];
                              newArray[index] = indexCur;
                              setCurentIndex(newArray);
                            }}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                              const isSelected = isObjectInArray(item);

                              if (variants.title === 'Drinks' && isSelected) {
                                const optionsSet = _.find(
                                  option?.optionSet,
                                  option =>
                                    item?.optionSetName === option?.name,
                                );

                                setOptionSets(optionsSet);
                              }

                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    if (variants.title === 'Drinks') {
                                      const optionsSet = _.find(
                                        option?.optionSet,
                                        option =>
                                          item?.optionSetName === option?.name,
                                      );

                                      handleAddToVariantsSizes(
                                        optionsSet?.options[0],
                                        'Sizes',
                                      );

                                      setOptionSets(optionsSet);
                                    }

                                    handleAddToVariants(item, variants.title);
                                  }}
                                  activeOpacity={1}>
                                  <VariantCard
                                    key={`variant-${item.name}-${index}`} // Provide a unique key prop here
                                    item={item}
                                    isSelected={isSelected}
                                  />
                                </TouchableOpacity>
                              );
                            }}
                          />
                        </>
                      );
                    })}

                    {optionSets?.length !== 0 &&
                      variants.title === 'Drinks' &&
                      optionSets?.options && (
                        <View style={{ marginTop: 20 }}>
                          <Text
                            style={{
                              color: theme.colors.black,
                              fontSize: 24,
                              fontWeight: 'bold',
                            }}>
                            Select {optionSets?.name}
                          </Text>
                          <FlatList
                            data={optionSets?.options}
                            keyExtractor={(item, itemIndex) =>
                              `${item.name}-${itemIndex}`
                            }
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                              const isSelected = isVariantObjectInArray(item);

                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelectedSizes({
                                      ...item,
                                      title: 'Sizes',
                                    });
                                  }}
                                  activeOpacity={1}>
                                  <VariantCard
                                    isSelected={isSelected}
                                    key={`option-${item.name}-${index}`} // Provide a unique key prop here
                                    item={item}
                                  />
                                </TouchableOpacity>
                              );
                            }}
                          />
                        </View>
                      )}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* action button */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginBottom: 30,
              gap: 10,
              paddingTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => handleCancel()}
              style={{
                backgroundColor: theme.colors.buttoncolor,
                width: (width - 300) / 2,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 25,
                borderRadius: 15,
              }}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 32,
                  fontWeight: 'bold',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddToBag()}
              style={{
                backgroundColor: theme.colors.primary,
                width: (width - 300) / 2,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 25,
                borderRadius: 15,
              }}>
              <Text
                style={{
                  color: theme.colors.white,
                  fontSize: 32,
                  fontWeight: 'bold',
                }}>
                Add to Bag
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  contentContainer: {
    borderRadius: 50,
  },
});

export default memo(VariantsModal);

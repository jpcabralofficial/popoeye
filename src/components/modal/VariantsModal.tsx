import React, { memo, useEffect, useMemo, useState } from 'react';
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

type Props = {
  isVisible: boolean;
  onModalHide?: () => void;
  item?: ProductType;
};

const VariantsModal = ({ isVisible, onModalHide, item }: Props) => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();

  const cartRedux = useSelector(cartSelector);

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

  const transformData = data => {
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
  };

  const handleCancel = () => {
    onCloseModal();
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

  // console.log(selectedVariants, 'variants');

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
            width: width - 200,
            height: item?.variants?.length === 0 ? 400 : height / 2 + 250,
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
              {_.map(anotherMappedVariants, variants => {
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
                        <FlatList
                          data={option?.options}
                          keyExtractor={(item, itemIndex) =>
                            `${item.name}-${itemIndex}`
                          }
                          horizontal
                          bounces={false}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {
                            const isSelected = isObjectInArray(item);

                            if (variants.title === 'Drinks' && isSelected) {
                              const optionsSet = _.find(
                                option?.optionSet,
                                option => item?.optionSetName === option?.name,
                              );

                              setOptionSets(optionsSet);
                            }

                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  // console.log(item, index);
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
                backgroundColor: theme.colors.background,
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
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddToBag()}
              style={{
                backgroundColor: theme.colors.accent,
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

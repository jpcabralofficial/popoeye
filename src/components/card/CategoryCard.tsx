import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { ActiveCategoriesType, CategoryPressType } from '../../utils/types';
import { IMAGES } from '../../utils/images';

type CategoryCardType = {
  item: ActiveCategoriesType;
  index: number;
  selected: boolean;
  handleCategoryPress: ({ item, index }: CategoryPressType) => void;
};

const CategoryCard = ({
  item,
  index,
  selected,
  handleCategoryPress,
}: CategoryCardType) => {
  const theme = useTheme();

  const activeSize = 170;
  const inactiveSize = 150;

  const activeOpacity = 1;

  return (
    <>
      {/* selected indicator */}
      {selected && (
        <View style={styles.indicatorContainer}>
          <Image source={IMAGES.SELECTED_INDICATOR_ICON} />
        </View>
      )}

      <TouchableOpacity
        onPress={() => handleCategoryPress({ item, index })}
        activeOpacity={activeOpacity}
        style={[
          styles.categoryCardContainer,
          {
            backgroundColor: theme.colors.white,
            width: selected ? activeSize : inactiveSize,
            height: selected ? activeSize : inactiveSize,
            borderColor: selected ? theme.colors.primary : theme.colors.white,
          },
        ]}>
        <Image
          source={{ uri: item.image_thumbnail }}
          style={styles.categoryCardImage}
          resizeMode="contain"
        />

        <Text
          numberOfLines={2}
          style={[
            styles.categoryCardText,
            {
              color: theme.colors.black,
            },
          ]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  categoryCardContainer: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 5,
    gap: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  categoryCardImage: {
    borderRadius: 20,
    height: '50%',
    width: '80%',
  },
  categoryCardText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
  },
  indicatorContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    overflow: 'visible',
    position: 'absolute',
    right: -40,
    zIndex: 1000,
  },
});

export default CategoryCard;

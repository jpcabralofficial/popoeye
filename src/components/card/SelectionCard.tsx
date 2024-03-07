import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';

type SelectionCardType = {
  image: ImageSourcePropType;
  label?: string;
  handleButtonPress: () => void;
};

const SelectionCard = ({
  image,
  label,
  handleButtonPress,
}: SelectionCardType) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleButtonPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.white,
          width: width / 2 - 40,
          height: width / 1.5,
        },
      ]}>
      <Image source={image} resizeMode="stretch" />

      {label && (
        <Text style={[styles.label, { color: theme.colors.black }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 30,
    gap: 100,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default SelectionCard;

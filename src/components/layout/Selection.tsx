import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';

import SelectionCard from '../card/SelectionCard';

type SelectionType = {
  title: string;
  firstSelectionImage: ImageSourcePropType;
  firstSelectionLabel?: string;
  firstSelectionButtonPress: () => void;
  secondSelectionImage: ImageSourcePropType;
  secondSelectionLabel?: string;
  secondSelectionButtonPress: () => void;
};

const Selection = ({
  title,
  firstSelectionImage,
  firstSelectionLabel,
  firstSelectionButtonPress,
  secondSelectionImage,
  secondSelectionLabel,
  secondSelectionButtonPress,
}: SelectionType) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            {
              width: width / 2 + 160,
              color: theme.colors.white,
            },
          ]}>
          {title}
        </Text>

        <View style={styles.cardsContainer}>
          <SelectionCard
            handleButtonPress={firstSelectionButtonPress}
            image={firstSelectionImage}
            label={firstSelectionLabel}
          />
          <SelectionCard
            handleButtonPress={secondSelectionButtonPress}
            image={secondSelectionImage}
            label={secondSelectionLabel}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    gap: 50,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Selection;

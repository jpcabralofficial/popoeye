import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import BackButton from '../../components/button/BackButton';
import Selection from '../../components/layout/Selection';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const CashlessPaymentScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const { handleCardPress } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CommonHeader separatorColor={theme.colors.white} />
      <Image
          source={IMAGES.BACKGROUND_IMAGE}
          style={{ height: "100%", width: width, zIndex: -1, position: "absolute"}}
          resizeMode="stretch"
        />
      <BackButton />

      <Selection
        title="Select mode of payment"
        firstSelectionImage={IMAGES.GCASH_LOGO}
        firstSelectionButtonPress={() => handleCardPress('gcash')}
        secondSelectionImage={IMAGES.MAYA_LOGO}
        secondSelectionButtonPress={() => handleCardPress('maya')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CashlessPaymentScreen;

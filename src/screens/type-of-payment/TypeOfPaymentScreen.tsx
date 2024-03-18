import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import Selection from '../../components/layout/Selection';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';
import BackButtonWhiteBackground from '../../components/button/BackButtonWhiteBackground';

const TypeOfPaymentScreen = () => {
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
      <BackButtonWhiteBackground />

      <Selection
        title="How would you like to pay?"
        firstSelectionLabel="Cash"
        firstSelectionImage={IMAGES.PAYMENT_CASH_ICON}
        firstSelectionButtonPress={() => handleCardPress('cash')}
        secondSelectionLabel={'Cashless \n (Card, E-wallet)'}
        secondSelectionImage={IMAGES.PAYMENT_CASHLESS_ICON}
        secondSelectionButtonPress={() => handleCardPress('cashless')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TypeOfPaymentScreen;

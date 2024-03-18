import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import Selection from '../../components/layout/Selection';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';
import BackButtonWhiteBackground from '../../components/button/BackButtonWhiteBackground';

const ModeOfPaymentScreen = () => {
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
        title="Select type of payment"
        firstSelectionLabel="Credit / Debit Card"
        firstSelectionImage={IMAGES.PAYMENT_CARD_ICON}
        firstSelectionButtonPress={() => handleCardPress('card')}
        secondSelectionLabel={'E-Wallets'}
        secondSelectionImage={IMAGES.PAYMENT_EWALLET_ICON}
        secondSelectionButtonPress={() => handleCardPress('e-wallet')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ModeOfPaymentScreen;

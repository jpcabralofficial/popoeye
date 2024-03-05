import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import BackButton from '../../components/button/BackButton';
import Selection from '../../components/layout/Selection';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const ModeOfPaymentScreen = () => {
  const theme = useTheme();

  const { handleCardPress } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CommonHeader separatorColor={theme.colors.white} />
      <BackButton />

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

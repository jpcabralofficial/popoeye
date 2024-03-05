import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import BackButton from '../../components/button/BackButton';
import Selection from '../../components/layout/Selection';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const TypeOfPaymentScreen = () => {
  const theme = useTheme();

  const { handleCardPress } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CommonHeader separatorColor={theme.colors.white} />
      <BackButton />

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

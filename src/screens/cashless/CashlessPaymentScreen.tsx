import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import BackButton from '../../components/button/BackButton';
import Selection from '../../components/layout/Selection';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';
import BackButtonWhiteBackground from '../../components/button/BackButtonWhiteBackground';

const CashlessPaymentScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const { handleCardPress } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CommonHeader />
      <Image
        source={IMAGES.BACKGROUND_IMAGE}
        style={{
          height: '100%',
          width: width,
          zIndex: -1,
          position: 'absolute',
        }}
        resizeMode="stretch"
      />
      <BackButtonWhiteBackground />

      <Selection
        title="Select mode of payment"
        firstSelectionImage={IMAGES.MODE_OF_PAYMENT_GCASH}
        firstSelectionButtonPress={() => handleCardPress('gcash')}
        secondSelectionImage={IMAGES.MODE_OF_PAYMENT_MAYA}
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

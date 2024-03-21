import React from 'react';
import {
  Image,
  Text,
  View,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const InstructionPaymentScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const { modeOfPayment } = useViewModel();

  const title =
    modeOfPayment === 'card'
      ? 'Please pay by tapping or inserting your credit / debit card in the payment device'
      : modeOfPayment === 'gcash'
      ? 'Please open your GCash App and scan the QR Code in the device to pay'
      : modeOfPayment === 'maya'
      ? 'Please open your Maya App and scan the QR Code in the device to pay'
      : '';

  const icon =
    modeOfPayment === 'card'
      ? IMAGES.INSTRUCTION_ICON_CARD
      : modeOfPayment === 'gcash'
      ? IMAGES.INSTRUCTION_ICON_GCASH
      : modeOfPayment === 'maya'
      ? IMAGES.INSTRUCTION_ICON_MAYA
      : '';

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
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.white,
                width: width / 2,
              },
            ]}>
            {title}
          </Text>

          <Image
            source={icon}
            style={{ width: width / 2 - 200, height: width / 1.1 }}
            resizeMode="stretch"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: 60,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InstructionPaymentScreen;

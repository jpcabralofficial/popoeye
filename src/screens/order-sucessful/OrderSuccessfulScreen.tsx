import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const OrderSuccessfulScreen = () => {
  const theme = useTheme();

  const { footerText, handleNavigatePress } = useViewModel();

  return (
    <TouchableOpacity
      onPress={handleNavigatePress}
      activeOpacity={1}
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <Image source={IMAGES.LANDERS_CENTRAL_LOGO} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.contentHeaderText, { color: theme.colors.white }]}>
          Thank you for Ordering!
        </Text>

        <View style={styles.contentTextContainer}>
          <Text
            style={[styles.contentOrderLabel, { color: theme.colors.white }]}>
            Your Order No.
          </Text>
          <Text
            style={[styles.contentOrderNumber, { color: theme.colors.white }]}>
            17
          </Text>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={[styles.footerText, { color: theme.colors.white }]}>
          {footerText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 50,
    justifyContent: 'center',
    width: 400,
  },
  contentHeaderText: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentOrderLabel: {
    fontSize: 30,
    textAlign: 'center',
  },
  contentOrderNumber: {
    fontSize: 100,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentTextContainer: {
    gap: 10,
  },
  footerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: 500,
  },
  footerText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default OrderSuccessfulScreen;
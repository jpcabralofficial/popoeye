import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const OnboardingScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const activeOpacity = 0.9;

  const { handleNavigation } = useViewModel();

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      activeOpacity={activeOpacity}
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* header */}
      <CommonHeader />
       <Image
          source={IMAGES.BACKGROUND_IMAGE}
          style={[styles.onboardingImage, { width: width, zIndex: -1, position: "absolute"}]}
          resizeMode="stretch"
        />
      {/* title header */}
      <View style={styles.headerTitleContainer}>
        <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
          Order and Pay Here
        </Text>
      </View>

      {/* onboarding image */}
      <View style={styles.onboardingImageContainer}>
        <Image
          source={IMAGES.ONBOARDING_IMAGE}
          style={[styles.onboardingImage, { width: width }]}
          resizeMode="stretch"
        />
      </View>

      {/* description */}
      <View style={styles.descriptionContainer}>
        <Image
          source={IMAGES.TOUCH_ICON}
          style={styles.touchIcon}
          resizeMode="stretch"
        />

        <Text style={[styles.descriptionText, { color: theme.colors.white }]}>
          Touch anywhere to start
        </Text>
      </View>

      {/* footer */}
      <View
        style={[
          styles.footerContainer,
          { backgroundColor: theme.colors.white },
        ]}>
        <Text style={[styles.footerText, { color: theme.colors.black }]}>
          Pay with <Text style={styles.footerTextSpan}>Cash</Text> or
        </Text>

        <View style={styles.footerLogosContainer}>
          <Image
            source={IMAGES.MAYA_LOGO}
            style={styles.logoMaya}
            resizeMode="contain"
          />

          <Image
            source={IMAGES.GCASH_LOGO}
            style={styles.logoGcash}
            resizeMode="contain"
          />

          <Image
            source={IMAGES.MASTERCARD_LOGO}
            style={styles.logoMasterCard}
            resizeMode="contain"
          />

          <Image
            source={IMAGES.VISA_LOGO}
            style={styles.logoVisa}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  descriptionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginVertical: 50,
  },
  descriptionText: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerLogosContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 24,
    paddingBottom: 10,
    textAlign: 'center',
  },
  footerTextSpan: {
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 62,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTitleContainer: {
    marginVertical: 60,
  },
  logoGcash: {
    height: 50,
    width: 90,
  },
  logoMasterCard: {
    height: 50,
    width: 40,
  },
  logoMaya: {
    height: 30,
    width: 70,
  },
  logoVisa: {
    height: 50,
    width: 50,
  },
  onboardingImage: {
    height: '100%',
  },
  onboardingImageContainer: {
    flex: 1,
  },
  touchIcon: {
    height: 40,
    width: 40,
  },
});

export default OnboardingScreen;

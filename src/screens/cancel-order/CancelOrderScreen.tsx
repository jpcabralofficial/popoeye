import React from 'react';
import {
  Text,
  View,
  useWindowDimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';
import CommonButton from '../../components/button/CommonButton';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const CancelOrderScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const { handleButtonPress } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CommonHeader />

      <View style={styles.contentContainer}>
      <Image
          source={IMAGES.BACKGROUND_IMAGE}
          style={{ height: "100%", width: width, zIndex: -1, position: "absolute"}}
          resizeMode="stretch"
        />
        <View style={styles.content}>
          <Image
            source={IMAGES.QUESTION_ICON}
            style={styles.questionIcon}
            resizeMode="stretch"
          />
          <Text
            style={[
              styles.headerTitleText,
              {
                width: width / 2 + 100,
                color: theme.colors.white,
              },
            ]}>
            Are you sure you want to cancel your order?
          </Text>

          <View style={[styles.buttonContainer, { width: width }]}>
            <CommonButton
              label="NO"
              labelColor={theme.colors.primary}
              backgroundColor={theme.colors.buttoncolor}
              size="half"
              onPress={() => handleButtonPress('no')}
            />

            <CommonButton
              label="YES"
              size="half"
              onPress={() => handleButtonPress('yes')}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    marginTop: 80,
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionIcon: {
    height: 200,
    width: 200,
  },
});

export default CancelOrderScreen;

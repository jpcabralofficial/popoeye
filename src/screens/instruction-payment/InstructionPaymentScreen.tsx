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

  useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CommonHeader separatorColor={theme.colors.white} />

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
            Please follow the instructions below
          </Text>

          <Image
            source={IMAGES.INSTRUCTION_ICON}
            style={{ width: width / 2 - 200, height: width / 2 }}
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
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InstructionPaymentScreen;

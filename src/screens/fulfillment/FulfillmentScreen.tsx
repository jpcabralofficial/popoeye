import React from 'react';
import {
  Text,
  useWindowDimensions,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const FulfillmentScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const { handleFulfillmentPress } = useViewModel();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* header */}
      <CommonHeader />
      <Image
          source={IMAGES.BACKGROUND_IMAGE}
          style={{ height: "100%", width: width, zIndex: -1, position: "absolute"}}
          resizeMode="stretch"
        />
      {/* content */}
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.titleHeaderText,
            { width: width / 2, color: theme.colors.white },
          ]}>
          Where do you want to eat?
        </Text>

        {/* dine in button */}
        <TouchableRipple
          onPress={() => handleFulfillmentPress('dine-in')}
          style={[
            styles.dineInButton,
            { width: width - 100, backgroundColor: theme.colors.white },
          ]}>
          <>
            <Image
              source={IMAGES.DINE_IN_ICON}
              style={styles.dineInIcon}
              resizeMode="stretch"
            />
            <Text style={[styles.dineInText, { color: theme.colors.primary }]}>
              Dine In
            </Text>
          </>
        </TouchableRipple>

        {/* take out button */}
        <TouchableRipple
          onPress={() => handleFulfillmentPress('take-out')}
          style={[
            styles.takeOutButton,
            { width: width - 100, backgroundColor: theme.colors.white },
          ]}>
          <>
            <Text style={[styles.takeOutText, { color: theme.colors.primary }]}>
              Take Out
            </Text>
            <Image
              source={IMAGES.TAKE_OUT_ICON}
              style={styles.takeOutIcon}
              resizeMode="stretch"
            />
          </>
        </TouchableRipple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 50,
    justifyContent: 'center',
  },
  dineInButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: 'row',
    gap: 60,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  dineInIcon: {
    height: 200,
    width: 200,
  },
  dineInText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  takeOutButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    flexDirection: 'row',
    gap: 60,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  takeOutIcon: {
    height: 200,
    width: 200,
  },
  takeOutText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  titleHeaderText: {
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FulfillmentScreen;

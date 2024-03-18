import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { IMAGES } from '../../utils/images';
import { COLORS } from '../../utils/colors';

const CommonHeader = () => {

  return (
    <>
      <View style={styles.container}>
        <Image
          source={IMAGES.POPEYES_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  logo: {
    height: 80,
    width: 200,
  },
});

export default CommonHeader;

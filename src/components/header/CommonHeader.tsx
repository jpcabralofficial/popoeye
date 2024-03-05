import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import { IMAGES } from '../../utils/images';

type CommonHeaderType = {
  separatorColor?: string;
};

const CommonHeader = ({ separatorColor }: CommonHeaderType) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <>
      <View style={styles.container}>
        <Image
          source={IMAGES.LANDERS_CENTRAL_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View
        style={[
          styles.separator,
          {
            backgroundColor: separatorColor
              ? separatorColor
              : theme.colors.accent,
            width: width,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  separator: {
    height: 7,
  },
});

export default CommonHeader;

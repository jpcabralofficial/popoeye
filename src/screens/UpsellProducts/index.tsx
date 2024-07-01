import React from 'react';
import { Box, FlatList, Image, VStack } from 'native-base';
import upsellProducts from './mockData';
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';
import { IMAGES } from './../../utils/images';
import ScrollViewIndicator from 'react-native-scroll-indicator';
import UpsellFooterTsx from './UpsellFooter';
const UpsellProducts = () => {
  return (
    <VStack flex={1}>
      <ImageBackground
        imageStyle={styles.imgBackground}
        style={styles.container}
        source={IMAGES.BACKGROUND_IMAGE}>
        <Box
          width={'100%'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={'40px'}>
          <Image
            source={IMAGES.POPEYES_LOGO}
            width={'173px'}
            resizeMode="stretch"
            height={'28px'}
          />
        </Box>
        <ScrollViewIndicator
          style={{ marginVertical: 10 }}
          indicatorHeight={250}
          shouldIndicatorHide={false}
          flexibleIndicator={false}
          scrollIndicatorStyle={styles.scrollIndicator}
          scrollIndicatorContainerStyle={styles.scrollCont}>
          <FlatList
            flex={1}
            data={upsellProducts}
            renderItem={() => {
              return <Box>hello</Box>;
            }}
          />
        </ScrollViewIndicator>

        <UpsellFooterTsx />
      </ImageBackground>
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
  },
  scrollCont: {
    backgroundColor: '#FFDB77',
    borderRadius: 10,
    bottom: 0,
    marginVertical: 3,
    overflow: 'visible',
    position: 'absolute',
    right: 10,
    top: 0,
    width: 4,
  },
  scrollIndicator: {
    backgroundColor: '#FFDB77',
    borderRadius: 6,
    opacity: 1,
    position: 'absolute',
    right: -5,
    width: 14,
  },
});
export default React.memo(UpsellProducts);

import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import Modal from 'react-native-modal';

import { IMAGES } from '../../utils/images';

type Props = {
  isVisible: boolean;
  onModalHide?: () => void;
  onPress: () => void;
  details?: string;
  buttonLabel?: string;
};

const MembershipExpiredModal = ({
  isVisible,
  onModalHide,
  onPress,
  details,
  buttonLabel,
}: Props) => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <Modal
      isVisible={isVisible}
      style={styles.container}
      onModalHide={onModalHide}>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors?.white,
            width: width - 200,
            height: height / 2 + 200,
          },
        ]}>
        <Image source={IMAGES.LANDERS_CARD} style={{ height: 400 }} />

        <Text style={[styles.details, { color: theme.colors.text }]}>
          {details}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: theme.colors.accent }]}>
            <Text style={[styles.buttonLabel, { color: theme.colors.white }]}>
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    paddingHorizontal: 60,
    paddingVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'space-around',
  },
  details: {
    fontSize: 37,
    textAlign: 'center',
  },
});

export default memo(MembershipExpiredModal);

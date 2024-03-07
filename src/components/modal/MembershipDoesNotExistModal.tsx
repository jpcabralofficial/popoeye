import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import Modal from 'react-native-modal';

type Props = {
  isVisible: boolean;
  onModalHide: () => void;
  onPress: () => void;
  title: string;
  details: string;
  buttonLabel: string;
};

const MembershipDoesNotExistModal = ({
  isVisible,
  onModalHide,
  onPress,
  title,
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
            height: height / 2 + 100,
          },
        ]}>
        <Text style={[styles.title, { color: theme.colors.accent }]}>
          {title}
        </Text>

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
    paddingTop: 100,
    padding: 20,
  },
  details: {
    fontSize: 42,
    marginTop: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default memo(MembershipDoesNotExistModal);

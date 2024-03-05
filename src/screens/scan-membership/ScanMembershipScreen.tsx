import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import CommonHeader from '../../components/header/CommonHeader';

import { IMAGES } from '../../utils/images';

import useViewModel from './useViewModel';

const ScanMembershipScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const placeholderText = '0000 - 0000 - 0000 - 0000';
  const maxLength = 19;

  const { textMembershipID, handleMembershipIDChange, handleConfirmPress } =
    useViewModel();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* header */}
      <CommonHeader />

      {/* content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* title header */}
        <Text style={[styles.titleHeaderText, { color: theme.colors.white }]}>
          Please scan your Landers Membership card below
        </Text>

        {/* barcode scanner icon */}
        <Image
          source={IMAGES.BARCODE_SCANNER_ICON}
          style={{ width: width / 2, height: width / 2 }}
          resizeMode="contain"
        />

        {/* text input */}
        <View>
          <Text style={[styles.textInputLabel, { color: theme.colors.white }]}>
            or you can type your Membership ID instead
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={[
                styles.textInput,
                { width: width / 2, backgroundColor: theme.colors.white },
              ]}
              keyboardType="number-pad"
              placeholder={placeholderText}
              value={textMembershipID}
              maxLength={maxLength}
              onChangeText={handleMembershipIDChange}
            />

            <TouchableOpacity
              onPress={handleConfirmPress}
              style={[
                styles.confirmButton,
                { backgroundColor: theme.colors.accent },
              ]}>
              <Text
                style={[
                  styles.confirmButtonLabel,
                  { color: theme.colors.white },
                ]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 23,
  },
  confirmButtonLabel: {
    fontSize: 20,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    gap: 50,
    justifyContent: 'center',
  },
  textInput: {
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 30,
    height: 72,
    paddingHorizontal: 30,
  },
  textInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  textInputLabel: {
    fontSize: 42,
    paddingHorizontal: 150,
    textAlign: 'center',
  },
  titleHeaderText: {
    fontSize: 65,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ScanMembershipScreen;

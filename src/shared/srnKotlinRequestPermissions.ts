import { Alert } from 'react-native';

import { requestPermissions } from 'serino-pos-kotlin-bridge';

const permissionAlert = () => {
  return new Promise(resolve => {
    Alert.alert(
      'Error',
      'Required app permissions has not been granted!',
      [{ text: 'RETRY', onPress: resolve }],
      { cancelable: false },
    );
  });
};

export const srnKotlinRequestPermissions = async () => {
  let granted = await requestPermissions();
  while (!granted) {
    await permissionAlert();
    granted = await requestPermissions();
  }
};

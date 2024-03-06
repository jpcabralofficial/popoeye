import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const BackButton = () => {
  const theme = useTheme();
  const { goBack } = useNavigation<any>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => goBack()}
        style={[styles.button, { borderColor: theme.colors.white }]}>
        <AntDesign name="arrowleft" size={40} color={theme.colors.white} />
        <Text style={[styles.buttonLabel, { color: theme.colors.white }]}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 10,
    marginLeft: 20,
    marginTop: 50,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  buttonLabel: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  container: {
    borderRadius: 10,
  },
});

export default BackButton;

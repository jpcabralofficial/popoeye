import React from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { theme } from '../../theme/theme';

type CommonButtonType = {
  label: string;
  labelColor?: string;
  backgroundColor?: string;
  size?: 'half' | 'full';
  onPress: () => void;
};

const CommonButton = ({
  label,
  labelColor = theme.colors.white,
  backgroundColor = theme.colors.accent,
  size = 'full',
  onPress,
}: CommonButtonType) => {
  const { width } = useWindowDimensions();

  return (
    <TouchableRipple
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          width: size === 'half' ? width / 2 - 40 : width - 40,
        },
      ]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  label: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default CommonButton;

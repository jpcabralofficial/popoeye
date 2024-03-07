import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const CartListHeader = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.listHeaderContainer}>
      <Text
        style={[
          styles.listHeaderText,
          { color: theme.colors.black, width: width / 4 - 100 },
        ]}>
        Qty
      </Text>
      <Text
        style={[
          styles.listHeaderText,
          { color: theme.colors.black, width: width / 4 + 50 },
        ]}>
        Item
      </Text>
      <Text
        style={[styles.listHeaderText, { color: theme.colors.black, flex: 1 }]}>
        Amount
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  listHeaderText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CartListHeader;

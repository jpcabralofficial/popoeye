import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const CartListHeader = () => {
  const theme = useTheme();

  return (
    <View style={styles.listHeaderContainer}>
      <Text style={[styles.listHeaderText, { color: theme.colors.black }]}>
        Qty
      </Text>
      <Text style={[styles.listHeaderText, { color: theme.colors.black }]}>
        Item
      </Text>
      <Text style={[styles.listHeaderText, { color: theme.colors.black }]}>
        Amount
      </Text>
      <Text style={[styles.listHeaderText, { color: theme.colors.black }]}>
        Action
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
  },
  listHeaderText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CartListHeader;

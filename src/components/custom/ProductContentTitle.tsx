import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type ProductContentHeaderType = {
  selectedCategory: string;
};

const ProductContentTitle = ({
  selectedCategory,
}: ProductContentHeaderType) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.black }]}>
        {selectedCategory}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
});

export default ProductContentTitle;

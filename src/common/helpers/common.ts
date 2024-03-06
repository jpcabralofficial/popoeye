export const thousandSeparator = (value: number) => {
  return value.toLocaleString('en-GB', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export const thousandSeparatorWithCurrencySign = (value: number) => {
  if (value < 0) {
    return `- ₱${thousandSeparator(Math.abs(value))}`;
  }
  return `₱${thousandSeparator(value)}`;
};

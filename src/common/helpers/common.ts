import _ from 'lodash';

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

type VariantType = {
  additional_price: number;
  image: string;
  name: string;
  status: boolean;
  optionSetName?: string;
  title: string;
};

export const mappedVariants = (selectedVariants: VariantType[]) => {
  const drinks = _.find(
    selectedVariants,
    variant => variant?.title === 'Drinks',
  );
  const sizes = _.find(selectedVariants, variant => variant?.title === 'Sizes');

  return _.compact(
    _.map(selectedVariants, item => {
      let itemName;
      let itemPrice;

      if (sizes?.title === item.title) {
        return;
      } else if (drinks?.title === item.title && !sizes?.name) {
        itemName = item.name;
        itemPrice = drinks.additional_price;
      } else if (drinks?.title === item.title && sizes?.name) {
        itemName = `${sizes.name} ${item.name}`;
        itemPrice = sizes.additional_price;
      } else {
        itemName = item.name;
        itemPrice = item.additional_price;
      }

      return {
        name: itemName,
        price: itemPrice,
        quantity: 1,
      };
    }),
  );
};

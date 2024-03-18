import { useState } from 'react';

import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  cartSelector,
  checkoutSelector,
  productSelector,
} from '../../common/redux/selector';
import { CANCEL_ORDER, MY_BAG } from '../../utils/navigation';
import {
  ActiveCategoriesType,
  CategoryPressType,
  ProductType,
} from '../../utils/types';
import {
  setAddQuantity,
  setAddToCart,
} from '../../common/redux/slices/cart/cart';

const useViewModel = () => {
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const checkoutRedux = useSelector(checkoutSelector);
  const cartRedux = useSelector(cartSelector);
  const productRedux = useSelector(productSelector);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  const groupByCategories = _.groupBy(productRedux.products, 'categories');
  const categories = _.map(groupByCategories, products => {
    return {
      name: products[0].categories,
      products: products,
      image_thumbnail: products[0].image_thumbnail,
    };
  });

  const activeCategories: ActiveCategoriesType[] = categories.filter(
    category => {
      // Check if any product in the category has status 'Active'
      const hasVisibleProduct = category.products.some(
        product => product.status === 'Active',
      );

      // Include the category in activeCategories only if it has a active product
      return hasVisibleProduct;
    },
  );

  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>(
    activeCategories[0]?.products,
  );

  const activeProducts = _.filter(
    selectedProducts,
    product => product.status === 'Active',
  );

  const getProductId = (id: string) =>
    cartRedux.cartItems.find(item => item.id === id);

  const cartCount = cartRedux.cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartRedux.cartItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const fulfillmentType =
    checkoutRedux.fulfillmentType === 'dine-in' ? 'Dine In' : 'Take Out';

  const handleCategoryPress = ({ item, index }: CategoryPressType) => {
    setSelectedCategoryIndex(index);
    setSelectedCategory(item.name);
    setSelectedProducts(item.products);
  };

  const handleAddToCart = (item: ProductType) => {
    dispatch(
      setAddToCart({ ...item, quantity: 1, amount: parseInt(item.price, 10) }),
    );
  };

  const handleAddQuantity = (id: string) => {
    dispatch(setAddQuantity(id));
  };

  const handleButtonPress = (buttonPress: 'cancel' | 'pay') => {
    if (buttonPress === 'cancel') {
      navigate(CANCEL_ORDER);
    } else {
      navigate(MY_BAG);
    }
  };

  const handleNavigatePress = () => {
    navigate(MY_BAG);
  };

  return {
    activeCategories,
    activeProducts,

    selectedCategory,
    selectedCategoryIndex,

    fulfillmentType,
    cartCount,
    cartTotal,

    getProductId,

    handleCategoryPress,

    handleAddToCart,
    handleAddQuantity,

    handleButtonPress,
    handleNavigatePress,
  };
};

export default useViewModel;

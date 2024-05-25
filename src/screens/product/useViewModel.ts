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

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  const [showVariantsModal, setShowVariantsModal] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<ProductType | undefined>();

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

  // put the category title on the list in order you want here
  const desiredOrder = [
    'Popeyes Chicken',
    'Burgers And Sandwiches',
    'Snack Box',
    'Buckets And Bundles',
    'Extras',
  ];

  const reorderedCategories = activeCategories.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.name);
    const indexB = desiredOrder.indexOf(b.name);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>(
    reorderedCategories[0]?.products,
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    reorderedCategories[0]?.name,
  );

  const activeProducts = _.filter(
    selectedProducts,
    product => product.status === 'Active',
  );

  const getProductId = (sku: string) =>
    cartRedux.cartItems.find(item => item.sku === sku);

  const cartCount = cartRedux.cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartRedux.cartItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const cartIds = _.map(cartRedux.cartItems, item => item.sku);

  const fulfillmentType =
    checkoutRedux.fulfillmentType === 'dine-in' ? 'Dine In' : 'Take Out';

  const handleCategoryPress = ({ item, index }: CategoryPressType) => {
    setSelectedCategoryIndex(index);
    setSelectedCategory(item.name);
    setSelectedProducts(item.products);
  };

  const handleAddToCart = (item: ProductType) => {
    setShowVariantsModal(true);
    setSelectedItem(item);
    // if (item.variants?.length !== 0) {
    //   setShowVariantsModal(true);
    //   setSelectedItem(item);
    // } else {
    //   dispatch(
    //     setAddToCart({
    //       ...item,
    //       quantity: 1,
    //       amount: parseInt(item.price, 10),
    //     }),
    //   );
    // }
  };

  const handleAddQuantity = (item: ProductType) => {
    setShowVariantsModal(true);
    setSelectedItem(item);
    // if (item.variants?.length !== 0) {
    //   setShowVariantsModal(true);
    //   setSelectedItem(item);
    // } else {
    //   dispatch(setAddQuantity(item.id));
    // }
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

  const handleCloseVariantModal = () => {
    setShowVariantsModal(false);
    setSelectedItem({
      id: '',
      sku: '',
      name: '',
      description: '',
      price: '',
      categories: '',
      tags: '',
      status: '',
      visibility: '',
      images: '',
      image_thumbnail: '',
      variants: [],
    });
  };

  return {
    reorderedCategories,
    activeCategories,
    activeProducts,

    selectedCategory,
    selectedCategoryIndex,
    selectedItem,

    showVariantsModal,

    fulfillmentType,
    cartCount,
    cartTotal,
    cartIds,

    getProductId,

    handleCategoryPress,

    handleAddToCart,
    handleAddQuantity,

    handleButtonPress,
    handleNavigatePress,

    handleCloseVariantModal,
  };
};

export default useViewModel;

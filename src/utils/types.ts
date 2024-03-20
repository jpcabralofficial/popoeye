export type ProductType = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  categories: string;
  tags: string;
  status: string;
  visibility: string;
  images: string;
  image_thumbnail: string;
  variants?: [];
};

export type ActiveCategoriesType = {
  name: string;
  products: ProductType[];
  image_thumbnail: string;
};

export type CategoryPressType = {
  item: ActiveCategoriesType;
  index: number;
};

export type VariantType = {
  additional_price: number;
  image: string;
  name: string;
  status: boolean;
};

export type ProductType = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  categories: string;
  tags: string;
  inventory: string;
  status: string;
  visibility: string;
  images: string;
  image_thumbnail: string;
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

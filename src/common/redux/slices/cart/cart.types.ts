import { ProductType } from '../../../../utils/types';

export default interface CartState {
  cartItems: Array<
    ProductType & {
      quantity: number;
      amount: number;
      selectedVariants?: {
        additional_price: number;
        image: string;
        name: string;
        status: boolean;
        optionSetName?: string;
        title: string;
      }[];
    }
  >;
}

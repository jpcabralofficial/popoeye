import {ProductType} from '../../../../utils/types';

export default interface CartState {
  cartItems: Array<ProductType & {quantity: number; amount: number}>;
}

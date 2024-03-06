import {RootState} from './store';

export const checkoutSelector = (state: RootState) => state.checkout;

export const cartSelector = (state: RootState) => state.cart;

import { createSlice } from '@reduxjs/toolkit';

import CartState from './cart.types';

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setAddToCart(state, action) {
      state.cartItems = [...state.cartItems, action.payload];
    },
    setRemoveQuantity(state, action) {
      state.cartItems = state.cartItems
        .map(item => {
          if (item.id === action.payload) {
            return {
              ...item,
              amount:
                (item.quantity - 1) *
                (parseInt(item.price, 10) +
                  (item?.variantsAdditionalAmount ?? 0)),
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    },
    setAddQuantity(state, action) {
      const updatedCartItems = state.cartItems.map(item => {
        if (item.id === action.payload) {
          console.log(item);
          return {
            ...item,
            amount:
              (item.quantity + 1) *
              (parseInt(item.price, 10) +
                (item?.variantsAdditionalAmount ?? 0)),
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      state.cartItems = updatedCartItems;
    },
    setUpdateCart(state, action) {
      const updatedCartItems = state.cartItems.map(item => {
        if (item.id === action.payload.id) {
          return action.payload;
        }

        return item;
      });

      state.cartItems = updatedCartItems;
    },
    removeItem(state, action) {
      state.cartItems = state.cartItems.filter(
        item => item.id !== action.payload,
      );
    },
    clearCart(state) {
      return { ...state, cartItems: initialState.cartItems };
    },
  },
});

export const {
  setAddToCart,
  setAddQuantity,
  setRemoveQuantity,
  setUpdateCart,
  removeItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

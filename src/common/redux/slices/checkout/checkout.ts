import {createSlice} from '@reduxjs/toolkit';

import CheckoutState from './checkout.types';

const initialState: CheckoutState = {
  fulfillmentType: '',
  typeOfPayment: '',
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setFulfillmentType(state, action) {
      return {...state, fulfillmentType: action.payload};
    },
    clearFulfillmentType(state) {
      return {...state, fulfillmentType: initialState.fulfillmentType};
    },
    setTypeOfPayment(state, action) {
      return {...state, typeOfPayment: action.payload};
    },
    clearTypeOfPayment(state) {
      return {...state, typeOfPayment: initialState.typeOfPayment};
    },
  },
});

export const {
  setFulfillmentType,
  clearFulfillmentType,

  setTypeOfPayment,
  clearTypeOfPayment,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

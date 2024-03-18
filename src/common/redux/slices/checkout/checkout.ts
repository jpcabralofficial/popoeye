import { createSlice } from '@reduxjs/toolkit';

import CheckoutState from './checkout.types';

const initialState: CheckoutState = {
  fulfillmentType: '',
  typeOfPayment: '',
  counterQueueTicket: 0,
  paymentStatus: '',
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setFulfillmentType(state, action) {
      return { ...state, fulfillmentType: action.payload };
    },
    clearFulfillmentType(state) {
      return { ...state, fulfillmentType: initialState.fulfillmentType };
    },
    setTypeOfPayment(state, action) {
      return { ...state, typeOfPayment: action.payload };
    },
    clearTypeOfPayment(state) {
      return { ...state, typeOfPayment: initialState.typeOfPayment };
    },
    incrementQueueTicket(state) {
      return { ...state, counterQueueTicket: state.counterQueueTicket + 1 };
    },
    setPaymentStatus(state, action) {
      return { ...state, paymentStatus: action.payload };
    },
    clearPaymentStatus(state) {
      return { ...state, paymentStatus: initialState.paymentStatus };
    },
  },
});

export const {
  setFulfillmentType,
  clearFulfillmentType,

  setTypeOfPayment,
  clearTypeOfPayment,

  incrementQueueTicket,

  setPaymentStatus,
  clearPaymentStatus,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

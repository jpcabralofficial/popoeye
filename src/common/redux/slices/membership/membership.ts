import { createSlice } from '@reduxjs/toolkit';

import MembershipState from './membership.types';

const initialState: MembershipState = {
  memberType: '',
  membershipBarcode: '',
};

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    setMembershipType(state, action) {
      return { ...state, memberType: action.payload };
    },
    clearMembershipType(state) {
      return { ...state, memberType: initialState.memberType };
    },
    setMembershipBarcode(state, action) {
      return { ...state, membershipBarcode: action.payload };
    },
    clearMembershipBarcode(state) {
      return { ...state, membershipBarcode: initialState.membershipBarcode };
    },
  },
});

export const {
  setMembershipType,
  clearMembershipType,

  setMembershipBarcode,
  clearMembershipBarcode,
} = membershipSlice.actions;
export default membershipSlice.reducer;

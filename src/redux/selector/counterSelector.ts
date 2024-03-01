import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const countSelector = createSelector(
  (state: RootState) => state.counter,
  counter => counter,
);

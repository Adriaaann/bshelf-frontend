import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-named-as-default
import bookSlice from './features/bookSlice';

const store = configureStore({
   reducer: {
      book: bookSlice,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

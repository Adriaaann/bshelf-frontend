import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Book {
   book: Array<any>;
}

const initialState: Book = {
   book: [],
};

export const fetchBook = createAsyncThunk(
   'book/fetch',
   async (book: string) => {
      const response = await fetch(
         `https://www.googleapis.com/books/v1/volumes/${book}`
      );
      const data = await response.json();

      return data;
   }
);

export const bookSlice = createSlice({
   name: 'book',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(fetchBook.fulfilled, (state: any, action: any) => {
         return {
            ...state,
            book: action.payload,
         };
      });
   },
});

export const selectBook = (state: RootState) => state.book.book;

export default bookSlice.reducer;

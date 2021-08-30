import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'categoryMenu',
  initialState: {
    currentCategory: '',
    categories: []
  },
  reducers: {
    updateCategories: (state, action) => {
      state.categories = [...action.payload];
    },
    updateCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    }
  }
});

export const { updateCategories, updateCurrentCategory } = slice.actions;

export const selectCategories = state => state.categoryMenu.categories;

export const selectCurrentCategory = state => state.categoryMenu.currentCategory;

export default slice.reducer;
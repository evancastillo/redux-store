import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    open: false
  },
  reducers: {
    addToCart: (state, action) => {
      state.open = true;
      state.items.push(action.payload);
    },
    updateCartQuantity: (state, action) => {
      state.open = true;
      state.items = state.items.map(product => {
        if (action.payload._id === product._id) {
          product.purchaseQuantity = action.payload.purchaseQuantity;
        }
        return product;
      });
    },
    addMultipleToCart: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    toggleCartOpen: (state) => {
      state.open = !state.open;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(product => {
        return product._id !== action.payload._id;
      });
      state.open = state.items.length > 0;
    }
  }
});

export const { addToCart, updateCartQuantity, addMultipleToCart, toggleCartOpen, removeFromCart } = slice.actions;

export const selectCart = state => state.cart.items;
export const selectCartOpen = state => state.cart.open;

export default slice.reducer;
import { configureStore } from '@reduxjs/toolkit'
import categoryMenuReducer from '../components/CategoryMenu/categoryMenuSlice';
import productListReducer from '../components/ProductList/productListSlice';
import cartReducer from '../components/Cart/cartSlice';

export default configureStore({
  reducer: {
    categoryMenu: categoryMenuReducer,
    productList: productListReducer,
    cart: cartReducer
  }
});

// reducer: {
//   products: [],
//   cart: [],
//   cartOpen: false,
//   categories: [],
//   currentCategory: ''
// }

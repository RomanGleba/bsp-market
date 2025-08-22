import { configureStore } from '@reduxjs/toolkit';
import cart from './cartSlice';
import auth from './authSlice';
import products from './productsSlice';

export default configureStore({
  reducer: { cart, auth, products }
});

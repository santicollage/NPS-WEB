import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import stockSlice from './slices/stockSlice';
import orderSlice from './slices/orderSlice';
import paymentSlice from './slices/paymentSlice';
import categorySlice from './slices/categorySlice';
import loadingSlice from './slices/loadingSlice';
import statsSlice from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice,
    cart: cartSlice,
    stock: stockSlice,
    orders: orderSlice,
    payments: paymentSlice,
    categories: categorySlice,
    loading: loadingSlice,
    stats: statsSlice,
  },
});

// Make store available globally for API interceptors
window.__REDUX_STORE__ = store;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import cartReducer from './slices/cartSlice';
import favoriteReducer from './slices/favoriteSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    cart: cartReducer,
    favorite: favoriteReducer,
  },
});

export default store;

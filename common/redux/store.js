import { configureStore } from '@reduxjs/toolkit';
import persistReducer from './slices/persistSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    persist: persistReducer,
    user: userReducer
  },
})
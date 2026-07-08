import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import appReducer from './appSlice';
import developerReducer from './developerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    apps: appReducer,
    developers: developerReducer,
  },
});

export default store;
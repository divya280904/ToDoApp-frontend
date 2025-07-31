import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import taskReducer from './slice/taskSlice';
import themeReducer from './slice/themeSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    theme: themeReducer,
  },
});

// Custom hook for dispatch (without TypeScript)
export const useAppDispatch = () => useDispatch();

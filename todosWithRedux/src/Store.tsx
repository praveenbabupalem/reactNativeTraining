import {configureStore} from '@reduxjs/toolkit';
import todosReducer from './TodosSlice';
import {useDispatch} from 'react-redux';

export const store = configureStore({
  reducer: {todosReducer},
  
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

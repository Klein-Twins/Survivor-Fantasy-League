import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import modalReducer from './slices/modalSlice.ts';

const store = configureStore({
    reducer: {
        auth: authReducer, modal: modalReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
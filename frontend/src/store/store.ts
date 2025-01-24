import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import modalReducer from './slices/modalSlice.ts';
import leagueInviteReducer from './slices/leagueInviteSlice.ts';
import leagueReducer from './slices/leagueSlice.ts';
const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    leagueInvite: leagueInviteReducer,
    league: leagueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

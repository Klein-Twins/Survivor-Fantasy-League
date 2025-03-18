import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import modalReducer from './slices/modalSlice.ts';
import leagueInviteReducer, {
  getLeagueInvites,
} from './slices/leagueInviteSlice.ts';
import leagueReducer, { getLeagues } from './slices/leagueSlice.ts';
import seasonReducer, { setSelectedSeason } from './slices/seasonSlice.ts';

// Create listener middleware
const listenerMiddleware = createListenerMiddleware();

// Add a listener for setSelectedSeason
listenerMiddleware.startListening({
  actionCreator: setSelectedSeason,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    // Extract seasonId from the selected season
    const seasonId = action.payload.id;

    // Extract profileId from authSlice
    const profileId = state.auth.account?.profileId;

    if (seasonId && profileId) {
      // Dispatch getLeagues with seasonId and profileId
      await listenerApi.dispatch(
        getLeagues({
          queryParams: { seasonId, profileId }, // Pass both seasonId and profileId
        })
      );
      await listenerApi.dispatch(
        getLeagueInvites({
          queryParams: { seasonId, profileId }, // Pass both seasonId and profileId
        })
      );
    }
  },
});

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    leagueInvite: leagueInviteReducer,
    league: leagueReducer,
    season: seasonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

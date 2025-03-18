import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ApiError,
  CompletedLeagueMemberSurvey,
  CreateLeagueRequestBody,
  CreateLeagueResponse,
  GetLeaguesResponse,
  League,
  LeagueSurvey,
} from '../../../generated-api';

import { ApiRequestParams } from '../../hooks/useApi';
import leagueService, {
  CreateLeagueRequestParams,
  GetLeaguesRequestParams,
} from '../../services/league/leagueService';

enum AuthActionTypes {
  GetLeagues = 'league/getLeagues',
  CreateLeague = 'league/createLeague',
}

type LeagueAndLeagueSurvey = {
  league: League;
  survey: LeagueSurvey | CompletedLeagueMemberSurvey;
};

interface LeagueState {
  leagues: League[];
  currentLeague: League | null;
  loading: boolean;
  error: ApiError | null;
}

const initialState: LeagueState = {
  leagues: [],
  currentLeague: null,
  loading: false,
  error: null,
};

export const createLeague = createAsyncThunk<
  CreateLeagueResponse,
  ApiRequestParams<CreateLeagueRequestBody, CreateLeagueRequestParams>,
  { rejectValue: ApiError }
>('league/createLeague', async (leagueData, { rejectWithValue }) => {
  try {
    const response = await leagueService.createLeague(leagueData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const getLeagues = createAsyncThunk<
  GetLeaguesResponse,
  ApiRequestParams<void, GetLeaguesRequestParams>,
  { rejectValue: ApiError }
>('league/getLeagues', async (params, { rejectWithValue }) => {
  try {
    const response = await leagueService.getLeagues(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {
    addLeague: (state, action: PayloadAction<League>) => {
      state.leagues.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ...existing cases...
      .addCase(getLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload.responseData.leagues;
      })
      .addCase(getLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(createLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeague.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues.push(action.payload.responseData.league);
      })
      .addCase(createLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { addLeague } = leagueSlice.actions;

export default leagueSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ApiError,
  CreateSeasonRequestBody,
  CreateSeasonResponse,
  Episode,
  GetSeasonsResponse,
  Season,
} from '../../../generated-api';
import { ApiRequestParams } from '../../hooks/useApi';
import seasonService from '../../services/season/seasonService';
import { getLeagues } from './leagueSlice';

enum SeasonActionTypes {
  GetSeasons = 'season/getSeasons',
  CreateSeason = 'season/createSeason',
}

interface SeasonState {
  seasons: Season[];
  activeSeason: Season | null;
  activeEpisode: Episode | null;
  nextSeason: Season | null;
  selectedSeason: Season | null;
  loading: boolean;
  error: ApiError | null;
}

const initialState: SeasonState = {
  seasons: [],
  activeSeason: null,
  nextSeason: null,
  selectedSeason: null,
  activeEpisode: null,
  loading: false,
  error: null,
};

export const getSeasons = createAsyncThunk<
  GetSeasonsResponse,
  void,
  { rejectValue: ApiError }
>(SeasonActionTypes.GetSeasons, async (_, { rejectWithValue }) => {
  try {
    const response = await seasonService.getSeasons();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createSeason = createAsyncThunk<
  CreateSeasonResponse,
  ApiRequestParams<CreateSeasonRequestBody, void>,
  { rejectValue: ApiError }
>('season/createSeason', async (params, { rejectWithValue }) => {
  try {
    const response = await seasonService.createSeason(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

//TBD - implement Create Season thunk

const seasonSlice = createSlice({
  name: 'season',
  initialState,
  reducers: {
    setActiveSeason: (state, action: PayloadAction<Season>) => {
      state.activeSeason = action.payload;
    },
    setSelectedSeason: (state, action: PayloadAction<Season>) => {
      state.selectedSeason = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeasons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSeasons.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = action.payload.responseData.seasons || [];
        state.activeSeason =
          action.payload.responseData.seasons.find(
            (season) => season.isActive
          ) || null;
        if (state.activeSeason) {
          const currentDate = new Date();
          state.activeEpisode =
            state.activeSeason.episodes.find(
              (episode) => episode.id === state.activeSeason.nextEpisode
            ) || null;
        } else {
          state.activeEpisode = null;
        }
        state.selectedSeason = state.activeSeason
          ? state.activeSeason
          : state.seasons[state.seasons.length - 1];
      })
      .addCase(getSeasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(createSeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeason.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = [...state.seasons, action.payload.responseData.season];
      })
      .addCase(createSeason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { setSelectedSeason } = seasonSlice.actions;

export default seasonSlice.reducer;

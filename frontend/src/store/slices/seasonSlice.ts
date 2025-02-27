import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiError, GetSeasonsResponse, Season } from '../../../generated-api';
import { ApiRequestParams } from '../../hooks/useApi';
import seasonService from '../../services/season/seasonService';

enum SeasonActionTypes {
  GetSeasons = 'season/getSeasons',
  CreateSeason = 'season/createSeason',
}

interface SeasonState {
  seasons: Season[];
  activeSeason: Season | null;
  selectedSeason: Season | null;
  loading: boolean;
  error: ApiError | null;
}

const initialState: SeasonState = {
  seasons: [],
  activeSeason: null,
  selectedSeason: null,
  loading: false,
  error: null,
};

export const getSeasons = createAsyncThunk<
  GetSeasonsResponse,
  ApiRequestParams<void, void>,
  { rejectValue: ApiError }
>(SeasonActionTypes.GetSeasons, async (seasonData, { rejectWithValue }) => {
  try {
    const response = await seasonService.getSeasons();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

//TBD - implement Create Season thunk

const seasonSlice = createSlice({
  name: 'season',
  initialState,
  reducers: {
    setActiveSeason: (state, action) => {
      state.activeSeason = action.payload;
    },
    setSelectedSeason: (state, action) => {
      state.selectedSeason = action.payload;
    },
  },
});

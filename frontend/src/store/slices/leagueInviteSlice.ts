import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ApiError,
  LeagueInvite,
  RespondToLeagueInviteResponse,
  RespondToLeagueInviteRequestBody,
  GetLeagueInvitesResponse,
  InviteResponse,
} from '../../../generated-api';

import { ApiRequestParams } from '../../hooks/useApi';
import { addLeague } from './leagueSlice';
import leagueInviteService, {
  GetLeagueInvitesRequestParams,
  RespondToLeagueInviteRequestParams,
} from '../../services/league/invite/leagueInviteService';

interface LeagueInviteState {
  leagueInvites: LeagueInvite[];
  loading: boolean;
  error: ApiError | null;
}

const initialState: LeagueInviteState = {
  leagueInvites: [],
  loading: false,
  error: null,
};

export const getLeagueInvites = createAsyncThunk<
  GetLeagueInvitesResponse,
  ApiRequestParams<void, GetLeagueInvitesRequestParams>,
  { rejectValue: ApiError }
>('leagueInvite/getLeagueInvites', async (params, { rejectWithValue }) => {
  try {
    const response = await leagueInviteService.getLeagueInvites(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const respondToLeagueInvite = createAsyncThunk<
  RespondToLeagueInviteResponse,
  ApiRequestParams<
    RespondToLeagueInviteRequestBody,
    RespondToLeagueInviteRequestParams
  >,
  { rejectValue: ApiError }
>(
  'leagueInvite/respondToLeagueInvite',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await leagueInviteService.respondToLeagueInvite(params);
      const inviteId = response.data.responseData.inviteId;
      dispatch(removeLeagueInvite({ inviteId }));
      if (params.body.inviteResponse === InviteResponse.Accept) {
        dispatch(addLeague(response.data.responseData.league));
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const leagueInviteSlice = createSlice({
  name: 'leagueInvite',
  initialState,
  reducers: {
    clearLeagueInviteError: (state) => {
      state.error = null;
    },
    removeLeagueInvite: (
      state,
      action: PayloadAction<{ inviteId: string }>
    ) => {
      state.leagueInvites = state.leagueInvites.filter(
        (invite) => invite.inviteId !== action.payload.inviteId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeagueInvites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeagueInvites.fulfilled, (state, action) => {
        state.loading = false;
        state.leagueInvites = action.payload.responseData?.leagueInvites || [];
      })
      .addCase(getLeagueInvites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(respondToLeagueInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToLeagueInvite.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(respondToLeagueInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearLeagueInviteError, removeLeagueInvite } =
  leagueInviteSlice.actions;

export default leagueInviteSlice.reducer;

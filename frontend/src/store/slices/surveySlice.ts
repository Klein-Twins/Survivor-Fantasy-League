import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ApiError,
  GetLeagueMemberSurveysResponse,
  LeagueMemberSurvey,
  SubmitSurveyRequestBody,
  SubmitSurveyResponse,
} from '../../../generated-api';
import { ApiRequestParams } from '../../hooks/useApi';
import surveyService, {
  GetLeagueSurveysRequestParams,
} from '../../services/league/survey/surveyService';
import { set } from 'date-fns';

interface SurveyState {
  surveys: LeagueMemberSurvey[];
  currentSurvey: LeagueMemberSurvey | null;
  getSurveysLoading: boolean;
  submitSurveyLoading: boolean;
  getSurveysError: ApiError | null;
  submitSurveyError: ApiError | null;
}

const initialState: SurveyState = {
  surveys: [],
  currentSurvey: null,
  getSurveysLoading: false,
  submitSurveyLoading: false,
  getSurveysError: null,
  submitSurveyError: null,
};

export const getSurveys = createAsyncThunk<
  GetLeagueMemberSurveysResponse,
  ApiRequestParams<void, GetLeagueSurveysRequestParams>,
  { rejectValue: ApiError }
>('survey/getSurveys', async (requestData, { rejectWithValue }) => {
  try {
    const response = await surveyService.getLeagueSurveys(requestData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const submitSurvey = createAsyncThunk<
  SubmitSurveyResponse,
  ApiRequestParams<SubmitSurveyRequestBody, void>,
  { rejectValue: ApiError }
>('survey/submitSurvey', async (requestData, { rejectWithValue }) => {
  try {
    const response = await surveyService.submitLeagueSurvey(requestData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

const updateSurveyLogic = (
  state: SurveyState,
  action: PayloadAction<LeagueMemberSurvey>
) => {
  const surveyIndex = state.surveys.findIndex(
    (survey) => survey.leagueSurveyId === action.payload.leagueSurveyId
  );
  if (surveyIndex !== -1) {
    state.surveys[surveyIndex] = action.payload;
  } else {
    console.log('Survey not found for update:', action.payload.leagueSurveyId);
  }
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    updateSurvey: updateSurveyLogic,
    setCurrentSurvey: (
      state,
      action: PayloadAction<LeagueMemberSurvey | null>
    ) => {
      state.currentSurvey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurveys.pending, (state) => {
        state.getSurveysLoading = true;
        state.getSurveysError = null;
      })
      .addCase(getSurveys.fulfilled, (state, action) => {
        state.getSurveysLoading = false;
        state.surveys = action.payload.responseData;
      })
      .addCase(getSurveys.rejected, (state, action) => {
        state.getSurveysLoading = false;
        state.getSurveysError = action.payload || null;
      })
      .addCase(submitSurvey.pending, (state) => {
        state.submitSurveyLoading = true;
        state.submitSurveyError = null;
      })
      .addCase(submitSurvey.fulfilled, (state, action) => {
        state.submitSurveyLoading = false;
        updateSurveyLogic(state, {
          payload: action.payload.responseData.leagueSurvey,
          type: 'survey/updateSurvey', // Mock type (not used in logic)
        });
        state.currentSurvey = action.payload.responseData.leagueSurvey;
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.submitSurveyLoading = false;
        state.submitSurveyError = action.payload || null;
      });
  },
});

export const { updateSurvey } = surveySlice.actions;
export const { setCurrentSurvey } = surveySlice.actions;

export default surveySlice.reducer;

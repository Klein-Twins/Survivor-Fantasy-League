import { AxiosResponse } from 'axios';
import {
  Episode,
  GetLeagueMemberSurveyResponse,
  League,
  Profile,
  SubmitSurveyRequestBody,
  SubmitSurveyResponse,
} from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';
import api from '../../apiContainer';

const surveyService = {
  getLeagueSurvey,
  submitLeagueSurvey,
};

export interface GetLeagueSurveyRequestParams {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  episodeId: Episode['id'];
}

async function getLeagueSurvey(
  requestData: ApiRequestParams<void, GetLeagueSurveyRequestParams>
): Promise<AxiosResponse<GetLeagueMemberSurveyResponse>> {
  const response: AxiosResponse<GetLeagueMemberSurveyResponse> =
    await api.surveyService.getLeagueSurvey(
      requestData.queryParams.leagueId,
      requestData.queryParams.profileId,
      requestData.queryParams.episodeId,
      {
        withCredentials: true,
      }
    );
  return response;
}

async function submitLeagueSurvey(
  requestData: ApiRequestParams<SubmitSurveyRequestBody, void>
): Promise<AxiosResponse<SubmitSurveyResponse>> {
  const response: AxiosResponse<SubmitSurveyResponse> =
    await api.surveyService.submitSurveyWithPickChoices(requestData.body, {
      withCredentials: true,
    });
  return response;
}

export default surveyService;

import { AxiosResponse } from 'axios';
import { ApiRequestParams } from '../../hooks/useApi';
import {
  GetCurrentEpisodSurveysResponse,
  GetLeagueSurveyResponse,
  League,
  Profile,
} from '../../../generated-api';
import api from '../apiContainer';

export interface GetLeagueSurveyPathParams {
  leagueId: string;
  episodeId: string;
  profileId: string;
}

export interface GetCurrentEpisodeSurveysParams {
  profileId: Profile['profileId'];
  leagueIds: League['leagueId'][];
}

async function getLeagueSurvey(
  requestData: ApiRequestParams<void, GetLeagueSurveyPathParams>
): Promise<AxiosResponse<GetLeagueSurveyResponse>> {
  const response: AxiosResponse<GetLeagueSurveyResponse> =
    await api.LeagueSurveyService.getSurveyForEpisodeForLeagueMember(
      requestData.queryParams.leagueId,
      requestData.queryParams.profileId,
      requestData.queryParams.episodeId,
      {
        withCredentials: true,
      }
    );
  return response;
}

async function getCurrentEpisodeLeagueSurveys(
  requestData: ApiRequestParams<void, GetCurrentEpisodeSurveysParams>
): Promise<AxiosResponse<GetCurrentEpisodSurveysResponse>> {
  const response: AxiosResponse<GetCurrentEpisodSurveysResponse> =
    await api.currentEpisodeService.getCurrentEpisodeSurveys(
      requestData.queryParams.profileId,
      requestData.queryParams.leagueIds,
      { withCredentials: true }
    );
  return response;
}

const leagueSurveyService = {
  getLeagueSurvey,
  getCurrentEpisodeLeagueSurveys,
};

export default leagueSurveyService;

import { AxiosResponse } from 'axios';
import { ApiRequestParams } from '../../hooks/useApi';
import { GetLeagueSurveyResponse } from '../../../generated-api';
import api from '../apiContainer';

export interface GetLeagueSurveyPathParams {
  leagueId: string;
  episodeId: string;
  profileId: string;
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

const leagueSurveyService = {
  getLeagueSurvey,
};

export default leagueSurveyService;

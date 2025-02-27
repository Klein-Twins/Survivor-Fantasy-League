import { AxiosResponse } from 'axios';
import { ApiRequestParams } from '../../hooks/useApi';
import { GetSurveyForEpisodeForLeagueMember } from '../../../generated-api';
import api from '../apiContainer';

export interface GetLeagueSurveyParams {
  leagueId: string;
  profileId: string;
  episodeNumber: number;
}

async function getLeagueSurvey(
  requestData: ApiRequestParams<void, GetLeagueSurveyParams>
): Promise<AxiosResponse<GetSurveyForEpisodeForLeagueMember>> {
  const response = await api.LeagueSurveyService.getSurveyForEpisodeForLeagueMember(
    requestData.queryParams.leagueId,
    [requestData.queryParams.episodeNumber],
    [requestData.queryParams.profileId]
  );
  return response;
}

const leagueSurveyService = {
  getLeagueSurvey,
};

export default leagueSurveyService;

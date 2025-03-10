import { AxiosResponse } from 'axios';
import { ApiRequestParams } from '../../hooks/useApi';
import {
  Episode,
  GetSurveyForEpisodeForLeagueMember,
  League,
  Profile,
} from '../../../generated-api';
import api from '../apiContainer';

export interface GetLeagueSurveyParams {
  leagueId: League['leagueId'];
  profileId: Profile['profileId'];
  episodeId: Episode['id'];
}

async function getLeagueSurvey(
  requestData: ApiRequestParams<void, GetLeagueSurveyParams>
): Promise<AxiosResponse<GetSurveyForEpisodeForLeagueMember>> {
  const response =
    await api.LeagueSurveyService.getSurveyForEpisodeForLeagueMember(
      requestData.queryParams.leagueId,
      [requestData.queryParams.episodeId],
      [requestData.queryParams.profileId]
    );
  return response;
}

const leagueSurveyService = {
  getLeagueSurvey,
};

export default leagueSurveyService;

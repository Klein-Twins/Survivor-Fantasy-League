import { AxiosResponse } from 'axios';
import { ApiRequestParams } from '../../../../hooks/useApi';
import {
  League,
  LeagueInviteProfileSearchResponse,
  Profile,
  SortByEnum,
} from '../../../../../generated-api';
import api from '../../../apiContainer';

export interface GetProfilesBySearchRequestParams
  extends ProfileSearchFormValues {
  leagueId: League['id'];
}

export interface ProfileSearchFormValues {
  userName?: Profile['userName'];
  firstName?: Profile['firstName'];
  lastName?: Profile['lastName'];
  page?: number;
  limit?: number;
  sortBy?: SortByEnum;
  isAsc?: boolean;
}

const ProfileSearchService = {
  search,
};

async function search(
  requestData: ApiRequestParams<void, GetProfilesBySearchRequestParams>
): Promise<AxiosResponse<LeagueInviteProfileSearchResponse>> {
  const response: AxiosResponse<LeagueInviteProfileSearchResponse> =
    await api.profileService.searchProfilesForLeagueInvite(
      requestData.queryParams.leagueId,
      //params.queryParams.profileId,
      requestData.queryParams.userName,
      requestData.queryParams.firstName,
      requestData.queryParams.lastName,
      requestData.queryParams.page,
      requestData.queryParams.limit,
      requestData.queryParams.sortBy,
      requestData.queryParams.isAsc,
      { withCredentials: true }
    );
  return response;
}

export default ProfileSearchService;

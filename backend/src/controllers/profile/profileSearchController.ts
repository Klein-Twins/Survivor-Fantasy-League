import { Request, Response, NextFunction } from 'express';
import {
  SearchProfilesForLeagueInviteResponse,
  SearchProfilesForLeagueInviteResponseData,
  SortByEnum,
} from '../../generated-api';
import { LeagueAttributes } from '../../models/league/League';
import profileSearchService from '../../services/profile/profileSearchService';
import profileSearchHelper from '../../helpers/profile/profileSearchHelper';

const profileSearchControler = {
  getProfilesBySearch,
};

export type ProfileSearchParamsForQuery = {
  userName?: string;
  firstName?: string;
  lastName?: string;
};
export type ProfileSearchPaginationForQuery = {
  page: number;
  limit: number;
  sortBy: SortByEnum;
  isAsc: boolean;
};

export interface ProfileSearchRequestParams {
  searchParamsForQuery: ProfileSearchParamsForQuery;
  paginationInfoForQuery: ProfileSearchPaginationForQuery;
  leagueId: LeagueAttributes['leagueId'];
}

async function getProfilesBySearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let response: SearchProfilesForLeagueInviteResponse;
  try {
    const { searchParamsForQuery, paginationInfoForQuery, leagueId } =
      profileSearchHelper.validateAndGetProfilesBySearchRequest(req);

    const responseData: SearchProfilesForLeagueInviteResponseData =
      await profileSearchService.getProfilesBySearch({
        searchParamsForQuery,
        paginationInfoForQuery,
        leagueId,
      });
    const response: SearchProfilesForLeagueInviteResponse = {
      responseData,
      message: `Found ${responseData.profilesFound?.length} profiles`,
      success: true,
      statusCode: 200,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default profileSearchControler;

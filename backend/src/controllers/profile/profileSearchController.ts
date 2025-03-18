import { Request, Response, NextFunction } from 'express';
import {
  LeagueInviteProfileSearchResponse,
  LeagueInviteProfileSearchResponseData,
  SortByEnum,
} from '../../generated-api';
import { LeagueAttributes } from '../../models/league/League';
import profileSearchHelper from '../../helpers/profile/profileSearchHelper';
import profileSearchService from '../../services/league/leagueInvite/profileSearchService';

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
  let response: LeagueInviteProfileSearchResponse;
  try {
    const { searchParamsForQuery, paginationInfoForQuery, leagueId } =
      profileSearchHelper.validateAndGetProfilesBySearchRequest(req);

    const responseData: LeagueInviteProfileSearchResponseData =
      await profileSearchService.getProfilesBySearch({
        searchParamsForQuery,
        paginationInfoForQuery,
        leagueId,
      });
    const response: LeagueInviteProfileSearchResponse = {
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

import { Request } from 'express';
import userHelper from '../auth/userHelper';
import profileHelper from '../auth/profileHelper';
import leagueHelper from '../league/leagueHelper';
import { BadRequestError } from '../../utils/errors/errors';
import { Pagination, SortByEnum } from '../../generated-api';
import {
  ProfileSearchPaginationForQuery,
  ProfileSearchParamsForQuery,
  ProfileSearchRequestParams,
} from '../../controllers/profile/profileSearchController';

const profileSearchHelper = {
  validateAndGetProfilesBySearchRequest,
  buildPagination,
};

function validateAndGetProfilesBySearchRequest(
  req: Request
): ProfileSearchRequestParams {
  const userName: string | undefined = req.query.userName as string;
  userHelper.validateUserName(userName);

  const firstName: string | undefined = req.query.firstName as string;
  profileHelper.validateName(firstName);
  const lastName: string | undefined = req.query.lastName as string;
  profileHelper.validateName(lastName);

  if (
    (!userName || userName.length === 0) &&
    (!firstName || firstName.length === 0) &&
    (!lastName || lastName.length === 0)
  ) {
    throw new BadRequestError(
      'At least one of userName, firstName, or lastName must be provided'
    );
  }

  const leagueId: string | undefined = req.query.leagueId as string;
  leagueHelper.validateLeagueId(leagueId);

  // Validate and convert pageNumberString
  const pageNumberString: string = (req.query.page as string) || '1';
  const pageNumber: number = parseInt(pageNumberString, 10);
  if (isNaN(pageNumber) || pageNumber <= 0) {
    throw new BadRequestError('Invalid page number');
  }

  // Validate and convert limitNumber
  const limitNumberString: string = (req.query.limit as string) || '10';
  const limitNumber: number = parseInt(limitNumberString, 10);
  if (isNaN(limitNumber) || limitNumber <= 0) {
    throw new BadRequestError('Invalid limit number');
  }

  // Validate and convert sortByString
  const sortByString: string =
    (req.query.sortBy as string) || SortByEnum.CreatedAt;
  if (!Object.values(SortByEnum).includes(sortByString as SortByEnum)) {
    throw new BadRequestError('Invalid sort by value');
  }
  const sortBy: SortByEnum = sortByString as SortByEnum;

  // Validate and convert isAsc
  const isAscString: string = (req.query.isAsc as string) || 'true';
  const isAsc: boolean = isAscString.toLowerCase() === 'true';
  if (
    isAscString.toLowerCase() !== 'true' &&
    isAscString.toLowerCase() !== 'false'
  ) {
    throw new BadRequestError('Invalid isAsc value');
  }

  const profileSearchParamsForQuery: ProfileSearchParamsForQuery = {
    userName,
    firstName,
    lastName,
  };
  const profileSearchPaginationForQuery: ProfileSearchPaginationForQuery = {
    page: pageNumber,
    limit: limitNumber,
    sortBy,
    isAsc,
  };

  return {
    searchParamsForQuery: profileSearchParamsForQuery,
    paginationInfoForQuery: profileSearchPaginationForQuery,
    leagueId,
  };
}

function buildPagination(
  paginationInfoForQuery: ProfileSearchPaginationForQuery,
  totalCount: number
): Pagination {
  return {
    currentPage: paginationInfoForQuery.page,
    totalPages: Math.ceil(totalCount / paginationInfoForQuery.limit),
    totalCount: totalCount,
  };
}

export default profileSearchHelper;

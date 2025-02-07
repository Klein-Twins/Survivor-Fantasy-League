import { QueryTypes } from 'sequelize';
import { sequelize } from '../../config/db';
import logger from '../../config/logger';
import { ProfileSearchRequestParams } from '../../controllers/profile/profileSearchController';
import {
  Profile,
  ProfileAndLeagueInviteStatus,
  SortByEnum,
} from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { InviteStatusEnum } from '../../models/league/LeagueProfile';
import { BadRequestError } from '../../utils/errors/errors';
import profileService from '../../services/auth/profileService';

export interface ProfileSearchResultWithTotalCount extends ProfileSearchResult {
  totalCount: number;
}

export interface ProfileSearchResult {
  profileId: ProfileAttributes['profileId'];
  inviteStatus: InviteStatusEnum;
}

const profileSearchRepository = {
  searchForProfilesToInviteToLeague,
};

async function searchForProfilesToInviteToLeague({
  searchParamsForQuery,
  paginationInfoForQuery,
  leagueId,
}: ProfileSearchRequestParams): Promise<{
  foundProfiles: ProfileAndLeagueInviteStatus[];
  totalCount: number;
}> {
  const offset =
    (paginationInfoForQuery.page - 1) * paginationInfoForQuery.limit;
  const sortDirection = paginationInfoForQuery.isAsc ? 'ASC' : 'DESC';

  const whereConditions: string[] = [];
  const replacements: any = {
    firstName: `%${searchParamsForQuery.firstName || ''}%`,
    lastName: `%${searchParamsForQuery.lastName || ''}%`,
    userName: `%${searchParamsForQuery.userName || ''}%`,
    leagueId,
    limit: paginationInfoForQuery.limit,
    offset: offset,
  };

  if (searchParamsForQuery.firstName)
    whereConditions.push('"Profile"."FIRST_NAME" ILIKE :firstName');
  if (searchParamsForQuery.lastName)
    whereConditions.push('"Profile"."LAST_NAME" ILIKE :lastName');
  if (searchParamsForQuery.userName)
    whereConditions.push('"User"."USER_NAME" ILIKE :userName');

  if (whereConditions.length === 0) {
    throw new BadRequestError(
      'At least one of firstName, lastName, or userName must be provided.'
    );
  }

  const whereClause = whereConditions.join(' AND ');

  let orderClause = '';
  switch (paginationInfoForQuery.sortBy) {
    case SortByEnum.UserName:
      orderClause = `ORDER BY "User"."USER_NAME" ${sortDirection}`;
      break;
    case SortByEnum.FirstName:
      orderClause = `ORDER BY "Profile"."FIRST_NAME" ${sortDirection}`;
      break;
    case SortByEnum.LastName:
      orderClause = `ORDER BY "Profile"."LAST_NAME" ${sortDirection}`;
      break;
    case SortByEnum.CreatedAt:
    default:
      orderClause = `ORDER BY "Profile"."UPDATED_AT" ${sortDirection}`;
      break;
  }

  // const sql = `
  //     SELECT
  //         "Profile"."PROFILE_ID" AS "profileId",
  //         "Profile"."FIRST_NAME" AS "firstName",
  //         "Profile"."LAST_NAME" AS "lastName",
  //         "Profile"."IMAGE_URL" AS "imageUrl",
  //         "Profile"."UPDATED_AT" AS "updatedAt",
  //         "User"."USER_NAME" AS "userName",
  //         "leagueProfiles"."INVITE_STATUS" AS "inviteStatus",
  //         CAST(COUNT(*) OVER () AS INTEGER) AS "totalCount"
  //     FROM "PRF_PROFILE" AS "Profile"
  //     INNER JOIN "USR_USERS" AS "User"
  //         ON "Profile"."PROFILE_ID" = "User"."USER_PROFILE_ID"
  //     LEFT OUTER JOIN "LGE_LEAGUES_PROFILES" AS "leagueProfiles"
  //         ON "Profile"."PROFILE_ID" = "leagueProfiles"."PROFILE_ID"
  //         AND "leagueProfiles"."LEAGUE_ID" = :leagueId
  //     WHERE
  //         ${whereClause}
  //     ${orderClause}
  //     LIMIT :limit OFFSET :offset;
  // `;
  const sql = `
          SELECT 
              "Profile"."PROFILE_ID" AS "profileId",
              "leagueProfiles"."INVITE_STATUS" AS "inviteStatus",
              CAST(COUNT(*) OVER () AS INTEGER) AS "totalCount"
          FROM "PRF_PROFILE" AS "Profile"
          INNER JOIN "USR_USERS" AS "User"
              ON "Profile"."PROFILE_ID" = "User"."USER_PROFILE_ID"
          LEFT OUTER JOIN "LGE_LEAGUES_PROFILES" AS "leagueProfiles"
              ON "Profile"."PROFILE_ID" = "leagueProfiles"."PROFILE_ID" 
              AND "leagueProfiles"."LEAGUE_ID" = :leagueId
          WHERE
              ${whereClause}
          ${orderClause}
          LIMIT :limit OFFSET :offset;
      `;

  const results = await sequelize.query<ProfileSearchResultWithTotalCount>(
    sql,
    {
      replacements,
      raw: true,
      logging: (sql) => {
        logger.debug(sql);
      },
      type: QueryTypes.SELECT,
    }
  );

  // If results are not empty, get totalCount from the first result
  const totalCount = results.length > 0 ? results[0].totalCount : 0;

  logger.error(results);

  const foundProfiles: ProfileAndLeagueInviteStatus[] = [];
  for (const result of results) {
    const profile: Profile = await profileService.getProfile(
      result.profileId,
      'profileId'
    );
    const isInvited: boolean = result.inviteStatus !== InviteStatusEnum.Pending;
    const isJoined: boolean = result.inviteStatus === InviteStatusEnum.Accepted;
    foundProfiles.push({
      profile,
      isInvited,
      isJoined,
    });
  }

  return {
    foundProfiles,
    totalCount: results.length > 0 ? results[0].totalCount : 0,
  };
}

export default profileSearchRepository;

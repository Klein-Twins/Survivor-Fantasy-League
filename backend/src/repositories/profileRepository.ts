import { Model, Op, QueryTypes, Sequelize, Transaction } from "sequelize";
import { Order } from "sequelize";
import { models, sequelize } from "../config/db";
import logger from "../config/logger";
import { ProfileAttributes } from "../models/Profile";
import { UserAttributes } from "../models/User";
import errorFactory from "../utils/errors/errorFactory";
import { INTERNAL_SERVER_ERROR } from "../constants/auth/responseErrorConstants";
import { ProfileSearchSortBy } from "../types/profile/profileTypes";

import { col } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';
import { Profile, ProfileAndLeagueInviteStatus, SortByEnum } from "../generated-api";
import { InviteStatusEnum, LeagueProfileAttributes } from "../models/LeagueProfile";
import { ProfileSearchParams } from "../controllers/profile/profileController";
import userRepository from "./userRepository";


export interface ProfileSearchResultWithTotalCount extends ProfileSearchResult {
    totalCount: number;
}

export interface ProfileSearchResult {
    profileId: ProfileAttributes["profileId"],
    // lastName?: ProfileAttributes["lastName"],
    // firstName?: ProfileAttributes["firstName"],
    // imageUrl: ProfileAttributes["imageUrl"],
    // userName: UserAttributes["userName"],
    inviteStatus: InviteStatusEnum
}

const profileRepository = {
    profileSearchQuery,
    getProfileByProfileId
};

async function profileSearchQuery(params: ProfileSearchParams): Promise<{ foundProfiles: ProfileAndLeagueInviteStatus[], totalCount: number }> {
    const {
        firstName,
        lastName,
        userName,
        sortBy,
        isAsc = 'true',
        page = 1,
        limit = 10,
    } = params;

    const offset = (page - 1) * limit;
    const sortDirection = isAsc === 'true' ? "ASC" : "DESC";
    const leagueId = params.leagueId;

    const whereConditions: string[] = [];
    const replacements: any = {
        firstName: `%${firstName || ''}%`,
        lastName: `%${lastName || ''}%`,
        userName: `%${userName || ''}%`,
        leagueId,
        limit,
        offset,
    };

    if (firstName) whereConditions.push('"Profile"."FIRST_NAME" ILIKE :firstName');
    if (lastName) whereConditions.push('"Profile"."LAST_NAME" ILIKE :lastName');
    if (userName) whereConditions.push('"User"."USER_NAME" ILIKE :userName');

    if (whereConditions.length === 0) {
        throw errorFactory({ statusCode: 500, error: 'At least one of firstName, lastName, or userName must be provided.' });
    }

    const whereClause = whereConditions.join(' AND ');

    let orderClause = '';
    switch (sortBy) {
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

    const results = await sequelize.query<ProfileSearchResultWithTotalCount>(sql, {
        replacements,
        raw: true,
        logging: ((sql) => {
            logger.debug(sql);
        }),
        type: QueryTypes.SELECT
    });

    // If results are not empty, get totalCount from the first result
    const totalCount = results.length > 0 ? results[0].totalCount : 0;

    logger.error(results);

    const foundProfiles: ProfileAndLeagueInviteStatus[] = [];
    for (const result of results) {
        const profile: Profile | null = await getProfileByProfileId(result.profileId);
        const isInvited: boolean = result.inviteStatus !== InviteStatusEnum.Pending;
        const isJoined: boolean = result.inviteStatus === InviteStatusEnum.Accepted;
        if (!profile) {
            continue;
        }
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

async function getProfileByProfileId(profileId: string): Promise<Profile | null> {
    const profileAttributes = await models.Profile.findOne({
        where: {
            profileId,
        },
    });

    if (!profileAttributes) {
        return null;
    }

    const userName = await userRepository.getUserIdByProfileId(profileAttributes.profileId);
    if (!userName) {
        return null;
    }

    const profile: Profile = {
        profileId: profileAttributes.profileId,
        userName,
        firstName: profileAttributes.firstName,
        lastName: profileAttributes.lastName,
        profileImageUrl: profileAttributes.imageUrl || "BACKUP LINK",
    }
    return profile;
}

export default profileRepository;
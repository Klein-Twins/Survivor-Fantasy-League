import { Model, Op, Sequelize, Transaction } from "sequelize";
import { Order } from "sequelize";
import { models, sequelize } from "../config/db";
import logger from "../config/logger";
import { ProfileAttributes } from "../models/Profile";
import { UserAttributes } from "../models/User";
import errorFactory from "../utils/errors/errorFactory";
import { INTERNAL_SERVER_ERROR } from "../constants/auth/responseErrorConstants";
import { ProfileSearchParams, ProfileSearchResult, ProfileSearchSortBy } from "../types/profile/profileTypes";

import { col } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';

const profileRepository = {

    /**
     * Creates a new profile record for a user.
     * 
     * @param input - The profile data to create a new profile.
     * @param transaction - The transaction used for atomic operations (optional).
     * 
     * @returns A promise that resolves to the newly created profile record.
     */
    createProfileRecord: async (
        input: ProfileAttributes,
        transaction?: Transaction
    ): Promise<ProfileAttributes> => {
        try {
            const profileRecord = (await models.Profile.create(input, { transaction })).get({ plain: true }) as ProfileAttributes;

            if (!profileRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            return profileRecord;
        } catch (error) {
            logger.error(`Failed to createProfile record for profile id ${input.profileId}: ${error}`);
            throw error;
        }
    },

    /**
     * Retrieves a profile by its Profile ID.
     * 
     * @param profileId - The ID of the profile to retrieve.
     * 
     * @returns A promise that resolves to the profile record.
     */
    getProfileRecordByProfileId: async (
        profileId: ProfileAttributes["profileId"]
    ): Promise<ProfileAttributes> => {
        try {
            const profileRecord = await models.Profile.findOne({
                where: { profileId },
            });

            if (!profileRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            logger.debug('Profile record found by Profile ID:', profileRecord.toJSON());
            return profileRecord;
        } catch (error) {
            logger.error(`Failed to get profile record by profile id ${profileId}: ${error}`);
            throw error;
        }
    },

    /**
     * Retrieves a profile by its associated User ID.
     * 
     * @param userId - The ID of the user whose profile is to be retrieved.
     * 
     * @returns A promise that resolves to the profile record.
     */
    getProfileRecordByUserId: async (
        userId: UserAttributes["userId"]
    ): Promise<ProfileAttributes> => {

        try {
            const profileRecord = await models.Profile.findOne({
                include: {
                    model: models.User,
                    required: true,
                    where: { USER_ID: userId },
                },
            });

            if (!profileRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            logger.debug('Profile record found by User ID:', profileRecord);
            return profileRecord;
        } catch (error) {
            logger.error(`Failed to get profile record by userId ${userId}: ${error}`);
            throw error;
        }

    },

    getProfilesBySearchForLeagueInvites: async (params: ProfileSearchParams): Promise<{ foundProfiles: ProfileSearchResult[], totalCount: number }> => {
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
        let leagueId = uuidv4();

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
            case 'userName':
                orderClause = `ORDER BY "User"."USER_NAME" ${sortDirection}`;
                break;
            case 'firstName':
                orderClause = `ORDER BY "Profile"."FIRST_NAME" ${sortDirection}`;
                break;
            case 'lastName':
                orderClause = `ORDER BY "Profile"."LAST_NAME" ${sortDirection}`;
                break;
            case 'updatedAt':
            default:
                orderClause = `ORDER BY "Profile"."UPDATED_AT" ${sortDirection}`;
                break;
        }

        const sql = `
            SELECT 
                "Profile"."PROFILE_ID" AS "profileId",
                "Profile"."FIRST_NAME" AS "firstName",
                "Profile"."LAST_NAME" AS "lastName",
                "Profile"."IMAGE_URL" AS "imageUrl",
                "Profile"."UPDATED_AT" AS "updatedAt",
                "User"."USER_NAME" AS "userName",
                "leagueProfiles"."INVITE_STATUS" AS "inviteStatus"
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

        const [results] = await sequelize.query(sql, {
            replacements,
            raw: true,
            logging: ((sql) => {
                logger.debug(sql);
            })
        })

        return {
            foundProfiles: results as ProfileSearchResult[],
            totalCount: results.length,
        };
    },
};

export default profileRepository;
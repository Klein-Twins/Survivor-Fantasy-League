import { Model } from 'sequelize';

import { APIResponseData } from '../api/apiResponseTypes';
import { SurvivorsAttributes } from '../../models/Survivors';
import { SeasonSurvivorCastMembersAttributes } from '../../models/SeasonSurvivorCastMembers';
import { SeasonSurvivorCastMembersOptionalAttributes } from '../../models/SeasonSurvivorCastMembers';

/**
 * API response for retrieving survivors list with detailed information, merged from different models.
 */
export interface SurvivorsWithDetailsBySeasonResponseData extends APIResponseData {
    survivors: SurvivorWithDetailsObject[];
}

export interface SeasonSurvivorWithDetailsAttributes extends SeasonSurvivorCastMembersAttributes {
    survivor: SurvivorsAttributes;  // Embed Survivor details within the main result type
}

export interface SeasonSurvivorCastMembersInstance
    extends Model<SeasonSurvivorCastMembersAttributes>,
        SeasonSurvivorCastMembersAttributes {
    Survivor?: SurvivorsAttributes | null;  // `Survivor` is optional and may be null
}

/**
 * A detailed survivor object used in the response.
 * This combines data from different models (e.g., Survivors, SeasonSurvivorCastMembers).
 */
export interface SurvivorWithDetailsObject {
    survivorId: string;
    seasonId: number;
    firstName?: string;
    lastName?: string;
    nickName?: string | null;
    originalTribeId: string | null;
    age: number;
    description: string;
    job: string;
    fromCity?: string | null;
    fromState?: string;
    fromCountry?: string;
    imageUrl: string;
}

/**
 * Extends SeasonSurvivorCastMembersAttributes and optionally includes a Survivor record.
 */
export interface SeasonSurvivorWithDetailsAttributes extends SeasonSurvivorCastMembersAttributes {
    Survivor?: SurvivorsAttributes | null;
}
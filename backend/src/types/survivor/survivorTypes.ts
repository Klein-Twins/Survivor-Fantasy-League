import { APIResponseData } from '../api/apiResponseTypes';
import { SurvivorsAttributes } from '../../models/Survivors';
import { SeasonSurvivorCastMembersAttributes } from '../../models/SeasonSurvivorCastMembers';

/**
 * API response for retrieving survivors list with detailed information, merged from different models.
 */
export interface SurvivorsWithDetailsBySeasonResponseData extends APIResponseData {
    survivors: SurvivorWithDetailsObject[];
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
    originalTribeId?: string | null;
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
    Survivor?: SurvivorsAttributes;
}
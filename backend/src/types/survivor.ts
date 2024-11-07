import { SeasonSurvivorCastMembersAttributes } from "../models/SeasonSurvivorCastMembers";
import { SurvivorsAttributes } from "../models/Survivors";
import { APIResponseData } from "./auth";


export interface SurvivorBySeasonResponseData extends APIResponseData {
    survivors: SurvivorObject[];
}


export interface SurvivorObject {
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

export interface SeasonSurvivorWithDetails extends SeasonSurvivorCastMembersAttributes {
    Survivor?: SurvivorsAttributes; 
}
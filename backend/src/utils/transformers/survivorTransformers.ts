import { SeasonSurvivorWithDetailsAttributes, SeasonSurvivorCastMembersInstance, SurvivorWithDetailsObject} from "../../types/survivor/survivorTypes"
import { SurvivorsAttributes } from "../../models/Survivors";

export function transformSurvivorWithDetailsData(
    input: SeasonSurvivorWithDetailsAttributes
): SurvivorWithDetailsObject {
    const survivor: SurvivorsAttributes = input.Survivor || {} as SurvivorsAttributes;  // Cast empty object as `SurvivorsAttributes`
    
    return {
        survivorId: input.SURVIVOR_ID,
        seasonId: input.SEASON_ID,
        originalTribeId: input.ORIGINAL_TRIBE_ID || null,
        age: input.AGE,
        description: input.DESCRIPTION || '',
        job: input.JOB,
        imageUrl: input.IMAGE_URL,
        firstName: survivor.FIRST_NAME,
        lastName: survivor.LAST_NAME,
        nickName: survivor.NICK_NAME ?? null,
        fromCity: survivor.FROM_CITY ?? null,
        fromState: survivor.FROM_STATE,
        fromCountry: survivor.FROM_COUNTRY,
    };
}
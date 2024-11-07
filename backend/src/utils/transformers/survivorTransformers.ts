import { SeasonSurvivorWithDetails, SurvivorObject } from "../../types/survivorTypes";

export const transformSurvivorWithDetailsData = (member: SeasonSurvivorWithDetails): SurvivorObject => ({
    survivorId: member.SURVIVOR_ID,
    seasonId: member.SEASON_ID,
    originalTribeId: member.ORIGINAL_TRIBE_ID,
    age: member.AGE,
    description: member.DESCRIPTION,
    job: member.JOB,
    imageUrl: member.IMAGE_URL,
    firstName: member.Survivor?.FIRST_NAME,
    lastName: member.Survivor?.LAST_NAME,
    nickName: member.Survivor?.NICK_NAME,
    fromCity: member.Survivor?.FROM_CITY,
    fromState: member.Survivor?.FROM_STATE,
    fromCountry: member.Survivor?.FROM_COUNTRY,
});
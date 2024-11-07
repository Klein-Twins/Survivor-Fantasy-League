import survivorRepository from "../../repositories/survivorRepository.ts";
import { SeasonSurvivorWithDetails } from "../../types/survivor.ts";
import errorFactory from "../../utils/errorFactory.ts";
import { SurvivorBySeasonResponseData } from "../../types/survivor.ts";

const survivorService = {
    getSurvivorsInSeason : async (seasonId: number): Promise<SurvivorBySeasonResponseData> => {

        const survivors: SeasonSurvivorWithDetails[] = await survivorRepository.getSurvivorsWithDetailsInSeason(seasonId);
        if (!survivors || survivors.length === 0) throw errorFactory({ message: `No survivors found for season ${seasonId}`, statusCode: 404 })
    
    
        const transformedSurvivors = survivors.map((member) => {
            return {
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
                fromCountry: member.Survivor?.FROM_COUNTRY
            };
        });
    
        return {
            statusCode: 200,
            message: 'Successfully found survivors',
            survivors: transformedSurvivors
        };
    }
}

export default survivorService;
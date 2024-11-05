import { RESPONSE_MESSAGES } from "../../routes/ResponseMessageConstants.ts";
import { SeasonSurvivorCastMembersAttributes} from '../../models/SeasonSurvivorCastMembers.ts'
import { models } from '../../config/db.ts';
import { SurvivorsAttributes } from "../../models/Survivors.ts";

class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export interface SeasonSurvivorWithDetails extends SeasonSurvivorCastMembersAttributes {
    Survivor?: SurvivorsAttributes; 
}

interface TransformedSurvivor {
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

const getSurvivorsBySeasonService = async (seasonId: string | undefined): Promise<{ statusCode: number; message: string; survivors: TransformedSurvivor[] }> => {
    if (!seasonId) {
        throw new CustomError(
            RESPONSE_MESSAGES.SURVIVORS.BAD_REQUEST_MISSING_SEASON_ID.statusCode,
            RESPONSE_MESSAGES.SURVIVORS.BAD_REQUEST_MISSING_SEASON_ID.message
        );
    }

    const seasonIdAsInteger = parseInt(seasonId, 10);
    if (!Number.isInteger(seasonIdAsInteger)) {
        throw new CustomError(
            RESPONSE_MESSAGES.SURVIVORS.BAD_REQUEST_INVALID_SEASON_ID.statusCode,
            RESPONSE_MESSAGES.SURVIVORS.BAD_REQUEST_INVALID_SEASON_ID.message
        );
    }

    console.log(seasonIdAsInteger);
    const survivors : SeasonSurvivorWithDetails[] = await models.SeasonSurvivorCastMembers.findAll({
        where: { SEASON_ID: seasonIdAsInteger },
        include: [
            {
                model: models.Survivors,
                attributes: ['FIRST_NAME', 'LAST_NAME', 'NICK_NAME', 'FROM_CITY', 'FROM_STATE', 'FROM_COUNTRY'],
            },
            {
                model: models.Seasons,
                attributes: [],
            },
        ]
    })


    if (survivors.length === 0) {
        throw new CustomError(
            RESPONSE_MESSAGES.SURVIVORS.NOT_FOUND_SEASON.statusCode,
            RESPONSE_MESSAGES.SURVIVORS.NOT_FOUND_SEASON.message
        );
    }

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
        statusCode: RESPONSE_MESSAGES.SURVIVORS.OK.statusCode,
        message: RESPONSE_MESSAGES.SURVIVORS.OK.message,
        survivors: transformedSurvivors
    };
};

export { getSurvivorsBySeasonService };
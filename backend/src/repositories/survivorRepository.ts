import {models} from '../config/db';
import { SeasonSurvivorWithDetails } from '../types/survivor';

const survivorRepository = {
    getSurvivorsWithDetailsInSeason : async (seasonId:number) : Promise<SeasonSurvivorWithDetails[]> => {
        const survivors : SeasonSurvivorWithDetails[] = await models.SeasonSurvivorCastMembers.findAll({
            where: { SEASON_ID: seasonId },
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
        });
        return survivors;
    }
}

export default survivorRepository;
import { models } from "../config/db";
import logger from "../config/logger";
import errorFactory from "../utils/errors/errorFactory";
import { NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { SeasonsAttributes } from "../models/Seasons";
import { Season } from "../generated-api";

const seasonRepository = {
    getSeasonBySeasonId
}

function buildSeasonObject(seasonData: SeasonsAttributes): Season {
    return {
        id: seasonData.seasonId,
        name: seasonData.name,
        startDate: seasonData.startDate.toString(),
        endDate: seasonData.endDate.toString(),
        location: seasonData.location,
        theme: seasonData.theme
    }
}

async function getSeasonBySeasonId(seasonId: SeasonsAttributes["seasonId"]): Promise<Season | null> {
    const seasonAttributes: SeasonsAttributes | null = await models.Seasons.findOne({
        where: { seasonId: seasonId },
    });

    if (!seasonAttributes) {
        return null;
    }

    return buildSeasonObject(seasonAttributes);
}

export default seasonRepository;
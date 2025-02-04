import { models } from '../config/db';
import { SeasonsAttributes } from '../models/season/Seasons';
import { Season } from '../generated-api';

const seasonRepository = {
  getSeasonBySeasonId,
};

function buildSeasonObject(seasonData: SeasonsAttributes): Season {
  return {
    id: seasonData.seasonId,
    name: seasonData.name,
    startDate: seasonData.startDate.toString(),
    endDate: seasonData.endDate.toString(),
    location: seasonData.location,
    theme: seasonData.theme,
  };
}

async function getSeasonBySeasonId(seasonId: SeasonsAttributes['seasonId']): Promise<Season | null> {
  const seasonAttributes: SeasonsAttributes | null = await models.Seasons.findOne({
    where: { seasonId: seasonId },
  });

  if (!seasonAttributes) {
    return null;
  }

  return buildSeasonObject(seasonAttributes);
}

export default seasonRepository;

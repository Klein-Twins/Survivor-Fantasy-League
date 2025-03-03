import { models } from '../../config/db';
import { CreateSeasonRequestBody, Season, Tribe } from '../../generated-api';
import seasonHelper from '../../helpers/season/seasonHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import tribeService from '../../services/season/tribeService';
import survivorService from '../../services/survivor/survivorService';
import { NotFoundError } from '../../utils/errors/errors';

const seasonRepository = {
  getSeason,
  createSeason,
  getAllSeasons,
};

async function getSeason(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Season> {
  const seasonAttributes: SeasonsAttributes | null =
    await models.Seasons.findByPk(seasonId);

  if (!seasonAttributes) {
    throw new NotFoundError(`Season with id ${seasonId} not found`);
  }
  const survivors = await survivorService.getSurvivorsBySeason([
    seasonAttributes.seasonId,
  ]);

  const tribes: Tribe[] = await tribeService.getTribes(
    seasonAttributes.seasonId
  );

  return seasonHelper.buildSeason(seasonAttributes, survivors, tribes);
}

async function getAllSeasons(): Promise<Season[]> {
  const seasonsAttributes: SeasonsAttributes[] = await models.Seasons.findAll();
  if (seasonsAttributes.length === 0) {
    throw new NotFoundError('No seasons found');
  }
  return Promise.all(
    seasonsAttributes.map(async (seasonAttributes: SeasonsAttributes) => {
      const survivors = await survivorService.getSurvivorsBySeason([
        seasonAttributes.seasonId,
      ]);
      const tribes: Tribe[] = await tribeService.getTribes(
        seasonAttributes.seasonId
      );
      return seasonHelper.buildSeason(seasonAttributes, survivors, tribes);
    })
  );
}

async function createSeason(
  seasonInfo: CreateSeasonRequestBody
): Promise<Season> {
  const seasonAttributes: SeasonsAttributes = {
    seasonId: Number(seasonInfo.seasonNumber),
    name: seasonInfo.name,
    startDate: new Date(seasonInfo.startDate),
    endDate: new Date(seasonInfo.endDate),
    location: seasonInfo.location,
    theme: seasonInfo.theme,
    isActive: seasonInfo.isActive,
  };

  const newSeasonAttributes = await models.Seasons.create(seasonAttributes);
  return seasonHelper.buildSeason(newSeasonAttributes, [], []);
}

export default seasonRepository;

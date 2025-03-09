import { Transaction } from 'sequelize';
import { models, sequelize } from '../../config/db';
import {
  CreateSeasonRequestBody,
  Episode,
  Season,
  Tribe,
} from '../../generated-api';
import seasonHelper from '../../helpers/season/seasonHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import episodeService from '../../services/season/episodeService';
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

  const episodes: Episode[] = await episodeService.getEpisodesBySeasonId(
    seasonAttributes.seasonId
  );

  return seasonHelper.buildSeason(
    seasonAttributes,
    survivors,
    tribes,
    episodes
  );
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
      const episodes: Episode[] = await episodeService.getEpisodesBySeasonId(
        seasonAttributes.seasonId
      );
      return seasonHelper.buildSeason(
        seasonAttributes,
        survivors,
        tribes,
        episodes
      );
    })
  );
}

async function createSeason(
  seasonInfo: CreateSeasonRequestBody,
  transaction?: Transaction
): Promise<SeasonsAttributes> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }
  try {
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
    if (!transaction && t) {
      await t.commit();
    }
    return newSeasonAttributes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default seasonRepository;

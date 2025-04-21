import { Op } from 'sequelize';
import { models } from '../../config/db';
import {
  SeasonsAttributes,
  SeasonsCreationAttributes,
} from '../../models/season/Seasons';

const seasonRepository = {
  createSeason,
  getAllSeasons,
  getSeasonById,
};
async function getAllSeasons(): Promise<SeasonsAttributes[]> {
  return await models.Seasons.findAll();
}

async function getSeasonById(
  seasonId: number
): Promise<SeasonsAttributes | null> {
  return await models.Seasons.findOne({
    where: {
      seasonId,
    },
  });
}

async function createSeason({
  seasonId,
  theme,
  location,
  name,
  startDate,
  endDate,
}: SeasonsCreationAttributes): Promise<SeasonsAttributes> {
  const foundNewerSeason = await models.Seasons.findOne({
    where: {
      seasonId: { [Op.gt]: seasonId },
    },
  });

  const isActive = !foundNewerSeason;

  if (isActive) {
    await models.Seasons.update(
      { isActive: false },
      {
        where: {
          seasonId: { [Op.lt]: seasonId },
        },
      }
    );
  }

  return await models.Seasons.create({
    seasonId,
    theme,
    location,
    name,
    startDate,
    endDate,
    isActive,
  });
}

export default seasonRepository;

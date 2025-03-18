import { models } from '../../config/db';
import { SeasonsAttributes } from '../../models/season/Seasons';

const seasonRepository = {
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
export default seasonRepository;

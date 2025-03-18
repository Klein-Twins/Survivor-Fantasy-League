import { models } from '../../config/db';
import { SeasonsAttributes } from '../../models/season/Seasons';

const seasonRepository = {
  getAllSeasons,
};
async function getAllSeasons(): Promise<SeasonsAttributes[]> {
  return await models.Seasons.findAll();
}
export default seasonRepository;

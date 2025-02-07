import { models } from '../../config/db';
import { Season } from '../../generated-api';
import seasonHelper from '../../helpers/season/seasonHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { NotFoundError } from '../../utils/errors/errors';

const seasonRepository = {
  getSeason,
};

async function getSeason(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Season> {
  const seasonAttributes: SeasonsAttributes | null =
    await models.Seasons.findByPk(seasonId);

  if (!seasonAttributes) {
    throw new NotFoundError(`Season with id ${seasonId} not found`);
  }

  return seasonHelper.buildSeason(seasonAttributes);
}

export default seasonRepository;

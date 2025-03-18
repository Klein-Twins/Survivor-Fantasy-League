import { models } from '../../config/db';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { TribeAttributes } from '../../models/season/Tribes';

const tribeRepository = {
  getTribesBySeasonId,
};

async function getTribesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<TribeAttributes[]> {
  const tribesAttributes: TribeAttributes[] = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });
  return tribesAttributes;
}

export default tribeRepository;

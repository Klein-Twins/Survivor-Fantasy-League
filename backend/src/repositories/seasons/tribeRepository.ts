import { models } from '../../config/db';
import { Tribe } from '../../generated-api';
import tribeHelper from '../../helpers/season/tribeHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { TribeAttributes } from '../../models/season/Tribes';
import { NotFoundError } from '../../utils/errors/errors';

const tribeRepository = {
  getTribesBySeasonId,
};

async function getTribesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Tribe[]> {
  const tribesAttributes: TribeAttributes[] = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });

  if (tribesAttributes.length === 0) {
    throw new NotFoundError('Tribes not found');
  }

  return tribesAttributes.map((tribeAttributes) => {
    return tribeHelper.buildTribe(tribeAttributes);
  });
}
export default tribeRepository;

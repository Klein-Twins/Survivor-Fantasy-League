import { UUID } from 'crypto';
import { models } from '../../config/db';
import { Tribe } from '../../generated-api';
import { TribeAttributes } from '../../models/season/Tribes';
import { NotFoundError } from '../../utils/errors/errors';

const tribeRepository = {
  getTribesBySeasonId,
  getTribeByTribeId,
};

function buildTribe(tribeAttributes: TribeAttributes): Tribe {
  return {
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: tribeAttributes.tribeColor,
    imageUrl: 'TODO: Add Tribe Image URL TO Model',
  };
}

async function getTribesBySeasonId(seasonId: number): Promise<Tribe[]> {
  const tribesAttributes: TribeAttributes[] = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });

  if (tribesAttributes.length === 0) {
    throw new NotFoundError('Tribes not found');
  }

  return tribesAttributes.map((tribeAttributes) => {
    return buildTribe(tribeAttributes);
  });
}

async function getTribeByTribeId(tribeId: UUID): Promise<Tribe> {
  const tribeAttributes: TribeAttributes | null = await models.Tribe.findOne({
    where: {
      id: tribeId,
    },
  });

  if (!tribeAttributes) {
    throw new NotFoundError('Tribe not found');
  }

  return buildTribe(tribeAttributes);
}

export default tribeRepository;

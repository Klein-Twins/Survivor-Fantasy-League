import { UUID } from 'crypto';
import { models } from '../../config/db';
import { Tribe } from '../../generated-api';
import { TribeAttributes } from '../../models/season/Tribes';
import errorFactory from '../../utils/errors/errorFactory';

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
    throw errorFactory({ message: 'Tribes not found', statusCode: 404 });
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
    throw errorFactory({ message: 'Tribe not found', statusCode: 404 });
  }

  return buildTribe(tribeAttributes);
}

export default tribeRepository;

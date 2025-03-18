import { models } from '../../config/db';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';

const survivorRepository = {
  getSurvivor,
  getSurvivorsBySeasonId,
};

async function getSurvivor(
  survivorId: SurvivorsAttributes['id'],
  seasonId: SurvivorDetailsOnSeasonAttributes['seasonId']
): Promise<
  SurvivorDetailsOnSeasonAttributes & { survivor: SurvivorsAttributes }
> {
  const survivorDetailsOnSeasonAttributes =
    await models.SurvivorDetailsOnSeason.findOne({
      where: {
        id: survivorId,
        seasonId: seasonId,
      },
    });

  if (!survivorDetailsOnSeasonAttributes) {
    throw new Error(
      `Survivor with id ${survivorId} not found on season${seasonId}`
    );
  }

  const survivorAttributes = await models.Survivors.findOne({
    where: {
      id: survivorId,
    },
  });

  if (!survivorAttributes) {
    throw new Error(`Survivor with id ${survivorId} not found`);
  }

  return {
    ...survivorDetailsOnSeasonAttributes,
    survivor: survivorAttributes,
  };
}

async function getSurvivorsBySeasonId(
  seasonId: SurvivorDetailsOnSeasonAttributes['seasonId']
): Promise<
  (SurvivorDetailsOnSeasonAttributes & { survivor: SurvivorsAttributes })[]
> {
  const survivorsAttributesOnSeason: SurvivorDetailsOnSeasonAttributes[] =
    await models.SurvivorDetailsOnSeason.findAll({
      where: {
        seasonId: seasonId,
      },
    });

  const survivorIdsOnSeason = survivorsAttributesOnSeason.map((survivor) => {
    return survivor.id;
  });

  return await Promise.all(
    survivorIdsOnSeason.map(
      async (survivorId) => await getSurvivor(survivorId, seasonId)
    )
  );
}

export default survivorRepository;

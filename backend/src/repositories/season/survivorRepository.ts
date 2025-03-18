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
  const survivorData = (await models.SurvivorDetailsOnSeason.findOne({
    where: {
      id: survivorId,
      seasonId: seasonId,
    },
    include: [
      {
        model: models.Survivors, // Include the Survivors model
        as: 'Survivor', // Alias the model as 'Survivor'
        required: true, // Ensures only matching Survivors are returned
      },
    ],
  })) as unknown as SurvivorDetailsOnSeasonAttributes & {
    survivor: SurvivorsAttributes;
  };

  return survivorData;
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

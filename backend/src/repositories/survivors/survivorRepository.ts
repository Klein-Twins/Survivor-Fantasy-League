import { models } from '../../config/db';
import { Survivor } from '../../generated-api';
import survivorHelper from '../../helpers/survivor/survivorHelper';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { InternalServerError } from '../../utils/errors/errors';

const survivorRepository = {
  getSurvivorsBySeasonId,
};

async function getSurvivorsBySeasonId(seasonId: number): Promise<Survivor[]> {
  try {
    const survivorsDetailAttributes: SurvivorDetailsOnSeasonAttributes[] =
      await models.SurvivorDetailsOnSeason.findAll({
        where: {
          seasonId: seasonId,
        },
      });

    let survivors: Survivor[] = [];

    for (const survivorDetailAttributes of survivorsDetailAttributes) {
      const survivorId = survivorDetailAttributes.survivorId;
      const survivorAttributes: SurvivorsAttributes | null =
        await models.Survivors.findOne({
          where: {
            survivorId: survivorId,
          },
        });
      if (!survivorAttributes) {
        throw new InternalServerError(
          'SurvivorDetailsAttributes is not tied to a SurvivorAttributes'
        );
      }
      const survivor: Survivor = survivorHelper.buildSurvivor(
        survivorAttributes,
        survivorDetailAttributes
      );
      survivors.push(survivor);
    }

    return survivors;
  } catch (error) {
    throw error;
  }
}

export default survivorRepository;

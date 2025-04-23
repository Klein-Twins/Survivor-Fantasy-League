import { injectable } from 'tsyringe';
import { TribalCouncilAttributes } from '../../../../models/season/tribalCouncil/TribalCouncil';
import { Transaction } from 'sequelize';
import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { TribalCouncilSurvivorsAttributes } from '../../../../models/season/tribalCouncil/TribalCouncilSurvivors';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../../../models/season/SeasonEliminations';

@injectable()
export class TribalCouncilRepository {
  async findTribalCouncilsByEpisodeId(
    episodeId: EpisodeAttributes['id']
  ): Promise<
    (TribalCouncilAttributes & {
      survivors: TribalCouncilSurvivorsAttributes[];
      elimination: SeasonEliminationAttributes;
    })[]
  > {
    const tribalCouncilData = (await models.TribalCouncils.findAll({
      where: {
        episodeId,
      },
      include: [
        {
          model: models.TribalCouncilSurvivors,
          as: 'survivors',
          required: false,
        },
        {
          model: models.SeasonEliminations,
          as: 'elimination',
          required: true,
        },
      ],
    })) as unknown as (TribalCouncilAttributes & {
      survivors: TribalCouncilSurvivorsAttributes[];
      elimination: SeasonEliminationAttributes;
    })[];

    return tribalCouncilData;
  }

  async saveTribalCouncilAttributes(
    tribalCouncilAttributes: TribalCouncilAttributes & {
      tribalCouncilSurvivorAttributes: TribalCouncilSurvivorsAttributes[];
    },
    transaction: Transaction
  ) {
    logger.debug(
      `${
        models.TribalCouncils.tableName
      }: Saving tribal council ${JSON.stringify(tribalCouncilAttributes)}`
    );
    await models.TribalCouncils.upsert(tribalCouncilAttributes, {
      transaction,
    });

    logger.debug(
      `${
        models.TribalCouncilSurvivors.tableName
      }: Saving tribal council survivors ${JSON.stringify(
        tribalCouncilAttributes.tribalCouncilSurvivorAttributes
      )}`
    );
    for (const tribalCouncilSurvivor of tribalCouncilAttributes.tribalCouncilSurvivorAttributes) {
      await models.TribalCouncilSurvivors.upsert(tribalCouncilSurvivor, {
        transaction,
      });
    }
  }
}

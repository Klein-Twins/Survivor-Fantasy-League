import { injectable } from 'tsyringe';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { models } from '../../../config/db';
import logger from '../../../config/logger';
import { Transaction } from 'sequelize';

@injectable()
export class EpisodeRepository {
  async findByPk(
    episodeId: EpisodeAttributes['id']
  ): Promise<EpisodeAttributes | null> {
    return await models.Episode.findByPk(episodeId);
  }

  async findEpisodeIdsBySeasonId(
    seasonId: EpisodeAttributes['seasonId']
  ): Promise<EpisodeAttributes['id'][]> {
    const episodes = await models.Episode.findAll({
      where: {
        seasonId,
      },
      attributes: ['id'],
    });

    return episodes.map((episode) => episode.id);
  }

  async saveEpisodeAttributes(
    episodeAttributes: EpisodeAttributes,
    transaction: Transaction
  ): Promise<void> {
    logger.debug(
      `${models.Episode.tableName}: Saving attributes: ${JSON.stringify(
        episodeAttributes
      )}`
    );
    await models.Episode.upsert(episodeAttributes, {
      transaction,
    });
  }
}

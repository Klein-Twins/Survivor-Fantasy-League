import { injectable } from 'tsyringe';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { models } from '../../../config/db';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';
import { Transaction } from 'sequelize';

@injectable()
export class EpisodeRepository {
  async findById(
    episodeId: EpisodeAttributes['id']
  ): Promise<EpisodeAttributes | null> {
    return await models.Episode.findByPk(episodeId).then((episodeData) =>
      episodeData ? episodeData.get({ plain: true }) : null
    );
  }

  async findBySeasonIdAndEpisodeNumber(
    seasonId: EpisodeAttributes['seasonId'],
    episodeNumber: EpisodeAttributes['number']
  ): Promise<EpisodeAttributes | null> {
    return await models.Episode.findOne({
      where: {
        seasonId,
        number: episodeNumber,
      },
    }).then((episodeData) =>
      episodeData ? episodeData.get({ plain: true }) : null
    );
  }

  async findAllEpisodesBySeasonId(
    seasonId: EpisodeAttributes['seasonId']
  ): Promise<EpisodeAttributes[]> {
    return await models.Episode.findAll({
      where: {
        seasonId,
      },
    }).then((episodesData) =>
      episodesData.map((episodeData) => episodeData.get({ plain: true }))
    );
  }

  @Transactional()
  async saveEpisodeAttributes(
    episodeAttributes: EpisodeAttributes,
    transaction?: Transaction
  ): Promise<void> {
    await models.Episode.upsert(episodeAttributes, {
      transaction,
    });
  }
}

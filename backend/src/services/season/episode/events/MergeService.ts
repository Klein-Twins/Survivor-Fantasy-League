import { inject, injectable } from 'tsyringe';
import { Episode } from '../../../../domain/season/episode/Episode';
import { Op, Transaction } from 'sequelize';
import { SeasonStorage } from '../../../../domain/season/Season';
import { TribeService } from '../../tribe/TribeService';
import logger from '../../../../config/logger';
import { SeasonSurvivor } from '../../../../domain/season/survivor/SeasonSurvivor';
import { models } from '../../../../config/db';
import { Tribe } from '../../../../domain/season/tribe/Tribe';

@injectable()
export class MergeEventService {
  constructor(
    @inject(SeasonStorage) private seasonStorage: SeasonStorage,
    @inject(TribeService) private tribeService: TribeService
  ) {}
  /**
   * This method is responsible for saving the merge related event.
   * The merge tribe should be saved in the database.
   * TODO: Need to implement the first survivor to be merged before tribal council (aka, wins the immunity challenge)
   *
   * @param episode
   * @param transaction
   */
  async saveMergeEvent(episode: Episode, transaction: Transaction) {
    if (!episode.getEpisodeEvents().getMerge()) {
      logger.warn(
        `Episode ${
          episode.getAttributes().id
        } does not have a merge event and merge event has been called.`
      );
      return;
    }

    const season = this.seasonStorage.getSeason(
      episode.getAttributes().seasonId
    );
    const mergeTribe = season.getMergeTribe();

    //Save the tribe
    await this.tribeService.saveTribe(mergeTribe, transaction);
  }

  async saveMergeStartTribeMembers(episode: Episode, transaction: Transaction) {
    const season = this.seasonStorage.getSeason(episode.getSeasonId());
    const mergingTribeMembers: SeasonSurvivor[] = season
      .getMergeTribe()
      .getTribeMemberRosterOnEpisode(episode.getEpisodeId()).episodeEnd;

    const mergeTribe: Tribe = season.getMergeTribe();

    const nonMergeTribes: Tribe[] = season
      .getTribes()
      .filter((tribe) => !tribe.getAttributes().mergeTribe);
    const nonMergeTribeIds: Tribe['id'][] = nonMergeTribes.map(
      (nonMergeTribe) => nonMergeTribe.getAttributes().id
    );
    const tribeMemberRecordsToUpdate = await models.TribeMembers.update(
      {
        episodeIdEnd: episode.getEpisodeId(),
      },
      {
        where: {
          episodeIdEnd: null,
          tribeId: { [Op.in]: nonMergeTribeIds },
        },
        transaction,
      }
    );
    for (const mergingTribeMember of mergingTribeMembers) {
      await models.TribeMembers.create(
        {
          survivorId: mergingTribeMember.getAttributes().id,
          tribeId: mergeTribe.getTribeId(),
          episodeIdStart: episode.getEpisodeId(),
          notes: 'Survivor started on merge tribe',
          isTribeSwitch: false,
          episodeIdEnd: null,
        },
        {
          transaction,
        }
      );
    }
  }
}

import { inject, injectable } from 'tsyringe';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { SeasonStorage } from '../../../domain/season/Season';
import { Episode } from '../../../domain/season/episode/Episode';
import { Tribe } from '../../../domain/season/tribe/Tribe';
import logger from '../../../config/logger';

@injectable()
export class TribeHelper {
  constructor(@inject(SeasonStorage) private seasonStorage: SeasonStorage) {}

  getActiveTribesOnEpisodeStart(episode: Episode): Tribe[] {
    const tribesInSeason = this.seasonStorage
      .getSeason(episode.getAttributes().seasonId)
      .getTribes();

    const { id: currentEpisodeId, number: currentEpisodeNumber } =
      episode.getAttributes();

    const activeTribesOnEpisodeStart = tribesInSeason.filter((tribe) => {
      const tribeEpisodeStart = tribe.getEpisodeStart();
      const { id: tribeEpisodeStartId, number: tribeEpisodeStartNumber } =
        tribeEpisodeStart.getAttributes();
      const tribeEpisodeEnd = tribe.getEpisodeEnd();

      if (
        tribe.getAttributes().mergeTribe &&
        tribeEpisodeStartId === currentEpisodeId
      ) {
        return false;
      }

      if (tribeEpisodeStartNumber <= episode.getAttributes().number) {
        if (!tribeEpisodeEnd) {
          return true;
        }
        const { id: tribeEpisodeEndId, number: tribeEpisodeEndNumber } =
          tribeEpisodeEnd.getAttributes();

        if (tribeEpisodeEndNumber > currentEpisodeNumber) {
          return true;
        }
      }
    });
    logger.debug(
      `Active tribes on episode ${currentEpisodeNumber} start: ${activeTribesOnEpisodeStart.map(
        (tribe) => tribe.getAttributes().name
      )}`
    );
    return activeTribesOnEpisodeStart;
  }

  getActiveTribesOnEpisodeEnd(episode: Episode): Tribe[] {
    const tribesInSeason = this.seasonStorage
      .getSeason(episode.getAttributes().seasonId)
      .getTribes();

    const { id: currentEpisodeId, number: currentEpisodeNumber } =
      episode.getAttributes();

    const activeTribesOnEpisodeEnd = tribesInSeason.filter((tribe) => {
      if (
        episode.getEpisodeEvents().getMerge() &&
        !tribe.getAttributes().mergeTribe
      ) {
        return false;
      }

      const tribeEpisodeStart = tribe.getEpisodeStart();
      const tribeEpisodeEnd = tribe.getEpisodeEnd();
      const { id: tribeEpisodeStartId, number: tribeEpisodeStartNumber } =
        tribeEpisodeStart.getAttributes();

      if (tribeEpisodeStartNumber <= currentEpisodeNumber) {
        if (!tribeEpisodeEnd) {
          return true;
        }
        const { id: tribeEpisodeEndId, number: tribeEpisodeEndNumber } =
          tribeEpisodeEnd.getAttributes();

        if (tribeEpisodeEndNumber > currentEpisodeNumber) {
          return true;
        }
      }
      return false;
    });

    logger.debug(
      `Active tribes on episode ${currentEpisodeNumber} end: ${activeTribesOnEpisodeEnd.map(
        (tribe) => tribe.getAttributes().name
      )}`
    );
    return activeTribesOnEpisodeEnd;
  }

  getActiveTribesOnEpisodeTribal(episode: Episode): Tribe[] {
    const tribesInSeason = this.seasonStorage
      .getSeason(episode.getAttributes().seasonId)
      .getTribes();

    const { id: currentEpisodeId, number: currentEpisodeNumber } =
      episode.getAttributes();

    const activeTribesOnEpisodeTribalCouncil = tribesInSeason.filter(
      (tribe) => {
        const tribeEpisodeStart = tribe.getEpisodeStart();
        const tribeEpisodeEnd = tribe.getEpisodeEnd();
        const { id: tribeEpisodeStartId, number: tribeEpisodeStartNumber } =
          tribeEpisodeStart.getAttributes();
        if (episode.getAttributes().isTribeSwitch) {
          return false;
        }

        if (tribeEpisodeStartNumber <= currentEpisodeNumber) {
          if (!tribeEpisodeEnd) {
            return true;
          }
          const { id: tribeEpisodeEndId, number: tribeEpisodeEndNumber } =
            tribeEpisodeEnd.getAttributes();

          if (tribeEpisodeEndNumber > currentEpisodeNumber) {
            return true;
          }
        }
        return false;
      }
    );
    logger.debug(
      `Active tribes on episode ${currentEpisodeNumber} tribal council: ${activeTribesOnEpisodeTribalCouncil.map(
        (tribe) => tribe.getAttributes().name
      )}`
    );
    return activeTribesOnEpisodeTribalCouncil;
  }
}

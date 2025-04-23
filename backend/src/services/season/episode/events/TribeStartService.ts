import { inject, injectable } from 'tsyringe';
import { models } from '../../../../config/db';
import { TribeAttributes } from '../../../../models/season/Tribes';
import { TribeService } from '../../tribe/TribeService';
import { TribeStart } from '../../../../domain/season/episode/events/TribeStart';
import { Tribe } from '../../../../domain/season/tribe/Tribe';
import { Episode } from '../../../../domain/season/episode/Episode';

@injectable()
export class TribeStartService {
  constructor(@inject(TribeService) private tribeService: TribeService) {}

  async fetchTribeStartsEventOnEpisode(
    episode: Episode
  ): Promise<TribeStart[]> {
    const episodeId = episode.getAttributes().id;
    const tribeIdsStartedOnEpisode: TribeAttributes['id'][] =
      await models.Tribe.findAll({
        where: {
          episodeIdStart: episodeId,
        },
      }).then((tribesAttributes) => tribesAttributes.map((tribe) => tribe.id));

    if (tribeIdsStartedOnEpisode.length === 0) {
      return [];
    }

    const tribeStarts: TribeStart[] = [];
    for (const tribeId of tribeIdsStartedOnEpisode) {
      const tribe: Tribe = await this.tribeService.fetchTribeByTribeId(tribeId);
      const tribeStart: TribeStart = new TribeStart(tribe);
      tribeStarts.push(tribeStart);
    }
    episode.getEpisodeEvents().addTribeStarts(tribeStarts);
    return tribeStarts;
  }
}

import { inject, injectable } from 'tsyringe';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { Episode } from '../../../domain/season/episode/Episode';
import { EpisodeRepository } from '../../../repositories/season/episode/EpisodeRepository';
import { BadRequestError } from '../../../utils/errors/errors';
import { Transaction } from 'sequelize';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { EpisodeEventService } from './events/EpisodeEventService';
import { SeasonStorage } from '../../../domain/season/Season';
import { TribeMemberService } from '../tribe/TribeMemberService';

@injectable()
export class EpisodeService {
  constructor(
    @inject(SeasonStorage) private seasonStorage: SeasonStorage,
    @inject(EpisodeRepository) private episodeRepository: EpisodeRepository,
    @inject(EpisodeEventService)
    private episodeEventService: EpisodeEventService,
    @inject(TribeMemberService) private tribeMemberService: TribeMemberService
  ) {}

  async fetchEpisodeById(episodeId: EpisodeAttributes['id']): Promise<Episode> {
    const episodeAttributes: EpisodeAttributes | null =
      await this.episodeRepository.findByPk(episodeId);

    if (!episodeAttributes) {
      throw new BadRequestError(`Episode with ID ${episodeId} not found`);
    }

    const episode = new Episode({
      seasonId: episodeAttributes.seasonId,
      id: episodeAttributes.id,
      number: episodeAttributes.number,
      title: episodeAttributes.title,
      airDate: episodeAttributes.airDate,
      description: episodeAttributes.description,
      type: episodeAttributes.type,
      isTribeSwitch: episodeAttributes.isTribeSwitch,
    });

    this.seasonStorage
      .getSeason(episodeAttributes.seasonId)
      .addEpisode(episode);

    await this.episodeEventService.fetchEpisodeEvents(episode);

    return episode;
  }

  async fetchEpisodeBySeasonId(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<Episode[]> {
    const episodeIdsInSeason: EpisodeAttributes['id'][] =
      await this.episodeRepository.findEpisodeIdsBySeasonId(seasonId);

    const episodes: Episode[] = [];
    for (const episodeId of episodeIdsInSeason) {
      const episode = await this.fetchEpisodeById(episodeId);
      episodes.push(episode);
    }

    return episodes;
  }

  async saveEpisode(episode: Episode, transaction: Transaction) {
    await this.episodeRepository.saveEpisodeAttributes(
      episode.getAttributes(),
      transaction
    );

    await this.episodeEventService.saveEpisodeEvents(
      episode.getEpisodeEvents(),
      transaction
    );
  }
}

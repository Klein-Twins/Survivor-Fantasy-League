import { Episode } from '../../../domain/season/episode/episode';

import { inject, injectable } from 'tsyringe';
import { EpisodeRepository } from '../../../repositories/season/episode/episodeRepository';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { Transaction } from 'sequelize';

@injectable()
export class EpisodeManager {
  constructor(
    @inject(EpisodeRepository) private episodeRepository: EpisodeRepository
  ) {}

  async fetchEpisodeById(episodeId: EpisodeAttributes['id']): Promise<Episode> {
    const episodeData = await this.episodeRepository.findById(episodeId);
    if (!episodeData) {
      throw new Error(`Episode with ID ${episodeId} not found`);
    }

    return new Episode(episodeData);
  }

  async fetchEpisodesBySeasonId(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<Episode[]> {
    const episodeData = await this.episodeRepository.findAllEpisodesBySeasonId(
      seasonId
    );
    if (!episodeData) {
      throw new Error(`Episodes for season ID ${seasonId} not found`);
    }

    const episodes: Episode[] = [];
    for (const episode of episodeData) {
      const episodeInstance = await this.fetchEpisodeById(episode.id);
      episodes.push(episodeInstance);
    }

    return episodes;
  }

  async saveEpisode(
    episode: Episode,
    transaction?: Transaction
  ): Promise<void> {
    await this.episodeRepository.saveEpisodeAttributes(
      episode.getAttributes(),
      transaction
    );
  }
}

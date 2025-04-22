import { inject, injectable } from 'tsyringe';
import { Season } from '../../domain/season/season';
import { SeasonRepository } from '../../repositories/season/seasonRepository';
import { EpisodeManager } from './episode/episodeManager';
import { SeasonSurvivorManager } from './survivor/seasonSurvivorManager';
import { TribeManager } from './tribe/tribeManager';
import { SeasonSurvivor } from '../../domain/season/survivor/seasonSurvivor';
import { Episode } from '../../domain/season/episode/episode';
import { Tribe } from '../../domain/season/tribe/tribe';
import { Transaction } from 'sequelize';
import sequelize from '../../config/db';
import { SurvivorEliminationService } from './survivor/survivorEliminationService';

@injectable()
export class SeasonManager {
  constructor(
    @inject(SeasonRepository) private seasonRepository: SeasonRepository,
    @inject(EpisodeManager) private episodeManager: EpisodeManager,
    @inject(SeasonSurvivorManager)
    private seasonSurvivorManager: SeasonSurvivorManager,
    @inject(TribeManager) private tribeManager: TribeManager,
    @inject(SurvivorEliminationService)
    private survivorEliminationService: SurvivorEliminationService
  ) {}

  async fetchSeasonById(seasonId: number): Promise<Season> {
    const seasonData = await this.seasonRepository.findById(seasonId);
    if (!seasonData) {
      throw new Error(`Season with ID ${seasonId} not found`);
    }

    const season: Season = new Season(seasonData);

    const survivors: SeasonSurvivor[] =
      await this.seasonSurvivorManager.fetchSurvivorsBySeasonId(seasonId);
    season.addSurvivors(survivors);

    const episodes: Episode[] =
      await this.episodeManager.fetchEpisodesBySeasonId(seasonId);
    season.addEpisodes(episodes);

    const tribes: Tribe[] = await this.tribeManager.fetchTribesBySeasonId(
      seasonId,
      survivors,
      episodes
    );
    season.addTribes(tribes);

    return season;
  }

  async saveSeason(season: Season, transaction?: Transaction): Promise<void> {
    await this.seasonRepository.saveSeason(season.getAttributes(), transaction);

    for (const episode of season.getEpisodes()) {
      await this.episodeManager.saveEpisode(episode, transaction);
    }

    for (const survivor of season.getSurvivors()) {
      await this.seasonSurvivorManager.saveSurvivor(survivor, transaction);
    }

    for (const tribe of season.getTribes()) {
      await this.tribeManager.saveTribe(tribe, transaction);
    }

    for (const survivor of season.getSurvivors()) {
      await this.survivorEliminationService.saveSurvivorElimination(
        survivor,
        season.getAttributes().seasonId,
        transaction
      );
    }
  }
}

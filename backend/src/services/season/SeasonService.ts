import { inject, injectable } from 'tsyringe';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { Season, SeasonStorage } from '../../domain/season/Season';
import { SeasonRepository } from '../../repositories/season/SeasonRepository';
import { BadRequestError } from '../../utils/errors/errors';
import { Transaction } from 'sequelize';
import { EpisodeService } from './episode/EpisodeService';
import { Episode } from '../../domain/season/episode/Episode';
import { SeasonSurvivorService } from './survivor/SeasonSurvivorService';
import { TribeService } from './tribe/TribeService';

@injectable()
export class SeasonService {
  constructor(
    @inject(SeasonRepository) private seasonRepository: SeasonRepository,
    @inject(EpisodeService) private episodeService: EpisodeService,
    @inject(SeasonSurvivorService)
    private seasonSurvivorService: SeasonSurvivorService,
    @inject(SeasonStorage) private seasonStorage: SeasonStorage,
    @inject(TribeService) private tribeService: TribeService
  ) {}

  async fetchSeasonById(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<Season> {
    const seasonAttributes: SeasonsAttributes | null =
      await this.seasonRepository.findByPk(seasonId);

    if (!seasonAttributes) {
      throw new BadRequestError(`Season with ID ${seasonId} not found`);
    }

    const season = new Season({
      seasonId: seasonAttributes.seasonId,
      theme: seasonAttributes.theme,
      location: seasonAttributes.location,
      name: seasonAttributes.name,
      startDate: seasonAttributes.startDate,
      endDate: seasonAttributes.endDate,
      isActive: seasonAttributes.isActive,
    });

    this.seasonStorage.addSeason(season);

    const survivors = await this.seasonSurvivorService.fetchSurvivorsBySeasonId(
      seasonId
    );
    for (const survivor of survivors) {
      season.addSurvivor(survivor);
    }

    await this.episodeService.fetchEpisodeBySeasonId(seasonId);

    // const tribes = await this.tribeService.fetchTribesBySeasonId(seasonId);
    // for (const tribe of tribes) {
    //   season.addTribe(tribe);
    // }

    return season;
  }

  async saveSeason(season: Season, transaction: Transaction) {
    await this.seasonRepository.saveSeasonAttributes(
      season.getAttributes(),
      transaction
    );

    for (const survivor of season.getSurvivors()) {
      await this.seasonSurvivorService.saveSeasonSurvivor(
        survivor,
        transaction
      );
    }

    for (const episode of season.getEpisodes()) {
      await this.episodeService.saveEpisode(episode, transaction);
    }

    // for (const tribe of season.getTribes()) {
    //   await this.tribeService.saveTribe(tribe, transaction);
    // }
  }
}

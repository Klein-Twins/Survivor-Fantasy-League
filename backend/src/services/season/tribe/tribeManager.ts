import { injectable, inject } from 'tsyringe';
import { TribeRepository } from '../../../repositories/season/tribe/tribeRepository';
import { Tribe } from '../../../domain/season/tribe/tribe';
import { TribeAttributes } from '../../../models/season/Tribes';
import { SeasonSurvivor } from '../../../domain/season/survivor/seasonSurvivor';
import { TribeMemberManager } from './tribeMemberManager';
import { Episode } from '../../../domain/season/episode/episode';
import { Transaction } from 'sequelize';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';
import { TribeStart } from '../../../data/foundation/data/ssn/dataTypes';
import { Season } from '../../../domain/season/season';

@injectable()
export class TribeManager {
  constructor(
    @inject(TribeRepository) private tribeRepository: TribeRepository,
    @inject(TribeMemberManager) private tribeMemberManager: TribeMemberManager
  ) {}

  processTribeStart(season: Season, episode: Episode, tribeStart: TribeStart) {
    const startingSurvivors = season
      .getSurvivors()
      .filter((survivor) =>
        tribeStart.startingSurvivors.includes(survivor.getAttributes().id)
      );

    const tribe = new Tribe(
      {
        id: tribeStart.id,
        name: tribeStart.name,
        seasonId: season.getAttributes().seasonId,
        episodeIdStart: episode.getAttributes().id,
        color: tribeStart.color,
        hexColor: tribeStart.hexColor,
        mergeTribe: episode.getAttributes().number !== 1,
        episodeIdEnd: null,
      },
      {
        startingTribeMembers: startingSurvivors,
        episodeStart: episode,
        episodeEnded: null,
      }
    );
  }

  async fetchTribeById(
    tribeId: TribeAttributes['id'],
    survivorsInSeason: SeasonSurvivor[],
    episodes: Episode[]
  ): Promise<Tribe> {
    const tribeData = await this.tribeRepository.findById(tribeId);
    if (!tribeData) {
      throw new Error(`Tribe with ID ${tribeId} not found`);
    }

    const episodeStart = tribeData.episodeIdStart
      ? episodes.find(
          (episode) => episode.getAttributes().id === tribeData.episodeIdStart
        ) || null
      : null;

    const episodeEnded = tribeData.episodeIdEnd
      ? episodes.find(
          (episode) => episode.getAttributes().id === tribeData.episodeIdEnd
        ) || null
      : null;

    const startingTribeMembers =
      await this.tribeMemberManager.fetchStartingTribeMembers(
        tribeId,
        survivorsInSeason
      );

    return new Tribe(tribeData, {
      episodeStart,
      episodeEnded,
      startingTribeMembers: startingTribeMembers,
    });
  }

  async fetchTribesBySeasonId(
    seasonId: TribeAttributes['seasonId'],
    survivorsInSeason: SeasonSurvivor[],
    episodes: Episode[]
  ): Promise<Tribe[]> {
    const tribesData = await this.tribeRepository.findAllBySeasonId(seasonId);

    const tribes: Tribe[] = [];
    for (const tribeData of tribesData) {
      const tribe = await this.fetchTribeById(
        tribeData.id,
        survivorsInSeason,
        episodes
      );
      tribes.push(tribe);
    }
    return tribes;
  }

  @Transactional()
  async saveTribe(tribe: Tribe, transaction?: Transaction): Promise<void> {
    await this.tribeRepository.save(tribe.getAttributes(), transaction);
  }
}

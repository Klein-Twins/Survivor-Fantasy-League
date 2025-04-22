import { inject, injectable } from 'tsyringe';
import { NotFoundError } from '../../../utils/errors/errors';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { SeasonSurvivorRepository } from '../../../repositories/season/survivor/seasonSurvivorRepository';
import { SeasonSurvivor } from '../../../domain/season/survivor/seasonSurvivor';
import { Transaction } from 'sequelize';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';
import { SurvivorEliminationService } from './survivorEliminationService';
import { SurvivorEliminationStatus } from '../../../domain/season/survivor/survivorFinishStatus';

@injectable()
export class SeasonSurvivorManager {
  constructor(
    @inject(SeasonSurvivorRepository)
    private seasonSurvivorRepository: SeasonSurvivorRepository,
    @inject(SurvivorEliminationService)
    private survivorEliminationService: SurvivorEliminationService
  ) {}

  async fetchSurvivorsBySeasonId(seasonId: number): Promise<SeasonSurvivor[]> {
    const survivorIdsInSeason =
      await this.seasonSurvivorRepository.findSurvivorsIdsInSeason(seasonId);

    const survivors: SeasonSurvivor[] = [];
    for (const survivorId of survivorIdsInSeason) {
      const survivor = await this.fetchSeasonSurvivorByIdAndSeasonId(
        survivorId,
        seasonId
      );
      survivors.push(survivor);
    }
    return survivors;
  }

  async fetchSeasonSurvivorByIdAndSeasonId(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SeasonSurvivor> {
    const survivorData =
      await this.seasonSurvivorRepository.findBySurvivorIdAndSeasonId(
        survivorId,
        seasonId
      );

    if (!survivorData) {
      throw new NotFoundError(`Survivor with ID ${survivorId} not found`);
    }

    const survivorEliminationStatus: SurvivorEliminationStatus =
      await this.survivorEliminationService.fetchSurvivorElimination(
        survivorId,
        seasonId
      );

    return new SeasonSurvivor(
      {
        id: survivorData.id,
        firstName: survivorData.firstName,
        lastName: survivorData.lastName,
        age: survivorData.age,
        description: survivorData.description,
        job: survivorData.job,
        seasonId: survivorData.seasonId,
        fromCity: survivorData.fromCity,
        fromState: survivorData.fromState,
        fromCountry: survivorData.fromCountry,
        nickName: survivorData.nickName,
      },
      {},
      survivorEliminationStatus
    );
  }

  async saveSurvivor(
    survivor: SeasonSurvivor,
    transaction?: Transaction
  ): Promise<void> {
    await this.seasonSurvivorRepository.saveSurvivor(
      survivor.getAttributes(),
      transaction
    );
  }
}

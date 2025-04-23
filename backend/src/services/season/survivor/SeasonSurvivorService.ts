import { inject, injectable } from 'tsyringe';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { BadRequestError, NotFoundError } from '../../../utils/errors/errors';
import { SeasonSurvivor } from '../../../domain/season/survivor/SeasonSurvivor';
import { Transaction } from 'sequelize';
import { SeasonSurvivorRepository } from '../../../repositories/season/survivor/SeasonSurvivorRepository';
import logger from '../../../config/logger';

@injectable()
export class SeasonSurvivorService {
  constructor(
    @inject(SeasonSurvivorRepository)
    private seasonSurvivorRepository: SeasonSurvivorRepository
  ) {}

  private async fetchSeasonSurvivorBySurvivorIdAndSeasonId(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SeasonSurvivor> {
    const seasonSurvivorAttributes =
      await this.seasonSurvivorRepository.findBySurvivorIdAndSeasonId(
        survivorId,
        seasonId
      );

    if (!seasonSurvivorAttributes) {
      throw new BadRequestError(
        `Season Survivor with Survivor ID ${survivorId} and Season ID ${seasonId} not found`
      );
    }

    const seasonSurvivor = new SeasonSurvivor({
      seasonId: seasonSurvivorAttributes.seasonId,
      id: seasonSurvivorAttributes.id,
      firstName: seasonSurvivorAttributes.firstName,
      lastName: seasonSurvivorAttributes.lastName,
      fromState: seasonSurvivorAttributes.fromState,
      fromCity: seasonSurvivorAttributes.fromCity,
      fromCountry: seasonSurvivorAttributes.fromCountry,
      nickName: seasonSurvivorAttributes.nickName,
      age: seasonSurvivorAttributes.age,
      description: seasonSurvivorAttributes.description,
      job: seasonSurvivorAttributes.job,
    });

    return seasonSurvivor;
  }

  async fetchSurvivorsBySeasonId(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SeasonSurvivor[]> {
    const survivorIds =
      await this.seasonSurvivorRepository.findSurvivorsIdsInSeason(seasonId);
    if (!survivorIds || survivorIds.length === 0) {
      logger.warn(`No survivors found for season with ID ${seasonId}`);
      return [];
    } else {
      const survivors: SeasonSurvivor[] = [];
      for (const survivorId of survivorIds) {
        const survivor = await this.fetchSeasonSurvivorBySurvivorIdAndSeasonId(
          survivorId,
          seasonId
        );
        survivors.push(survivor);
      }
      return survivors;
    }
  }

  async saveSeasonSurvivor(
    survivor: SeasonSurvivor,
    transaction: Transaction
  ): Promise<void> {
    await this.seasonSurvivorRepository.saveSeasonSurvivorAttirbutes(
      survivor.getAttributes(),
      transaction
    );
  }
}

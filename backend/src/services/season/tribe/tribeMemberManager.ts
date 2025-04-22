import { inject, injectable } from 'tsyringe';
import { TribeMemberRepository } from '../../../repositories/season/tribe/tribeMemberRepository';
import { TribeAttributes } from '../../../models/season/Tribes';
import { InternalServerError } from '../../../utils/errors/errors';
import { SeasonSurvivor } from '../../../domain/season/survivor/seasonSurvivor';

@injectable()
export class TribeMemberManager {
  constructor(
    @inject(TribeMemberRepository)
    private tribeMemberRepository: TribeMemberRepository
  ) {}

  async fetchStartingTribeMembers(
    tribeId: TribeAttributes['id'],
    survivorsInSeason: SeasonSurvivor[]
  ) {
    const startingTribeMemberIds =
      await this.tribeMemberRepository.findStartingTribeMemberIdsForTribe(
        tribeId
      );

    if (!startingTribeMemberIds || startingTribeMemberIds.length === 0) {
      throw new InternalServerError(
        `No starting tribe members found for tribe ID ${tribeId}`
      );
    }

    return survivorsInSeason.filter((survivor) =>
      startingTribeMemberIds.includes(survivor.getAttributes().id)
    );
  }
}

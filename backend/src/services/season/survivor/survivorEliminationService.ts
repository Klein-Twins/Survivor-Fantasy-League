import { inject, injectable } from 'tsyringe';
import { Episode } from '../../../domain/season/episode/episode';
import { Season } from '../../../domain/season/season';
import { SurvivorEliminationDetails } from '../episode/events/survivorEliminationEventService';
import { SeasonSurvivor } from '../../../domain/season/survivor/seasonSurvivor';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { Transaction } from 'sequelize';
import { SurvivorEliminationRepository } from '../../../repositories/season/survivor/survivorEliminationRepository';
import { TribeMemberRepository } from '../../../repositories/season/tribe/tribeMemberRepository';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { SurvivorEliminationStatus } from '../../../domain/season/survivor/survivorFinishStatus';
import { SeasonEliminationAttributes } from '../../../models/season/SeasonEliminations';

@injectable()
export class SurvivorEliminationService {
  constructor(
    @inject(SurvivorEliminationRepository)
    private survivorEliminationRepository: SurvivorEliminationRepository,
    @inject(TribeMemberRepository)
    private tribeMemberRepository: TribeMemberRepository
  ) {}

  async fetchSurvivorElimination(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SurvivorEliminationStatus> {
    const survivorEliminationAttributes: SeasonEliminationAttributes | null =
      await this.survivorEliminationRepository.findSurvivorElimination(
        survivorId,
        seasonId
      );

    if (!survivorEliminationAttributes) {
      return new SurvivorEliminationStatus({
        isTorchSnuffed: false,
        eliminationDetails: null,
      });
    } else {
      return new SurvivorEliminationStatus({
        isTorchSnuffed: true,
        eliminationDetails: {
          episodeIdEliminated: survivorEliminationAttributes.episodeId,
          seq: survivorEliminationAttributes.seq,
          notes: survivorEliminationAttributes.notes,
          placement: survivorEliminationAttributes.placement,
          dayEliminated: survivorEliminationAttributes.day,
          juryPlacement: survivorEliminationAttributes.juryPlacement,
          eliminationType: survivorEliminationAttributes.type,
        },
      });
    }
  }

  processSurvivorElimination(
    season: Season,
    episode: Episode,
    survivorElimination: SurvivorEliminationDetails
  ) {
    const survivor: SeasonSurvivor = season.getSurvivorById(
      survivorElimination.survivorId
    );

    survivor.eliminate({
      episodeIdEliminated: episode.getAttributes().id,
      seq: survivorElimination.seq,
      notes: survivorElimination.notes,
      placement: survivorElimination.placement,
      dayEliminated: survivorElimination.day,
      juryPlacement: survivorElimination.juryPlacement,
      eliminationType: survivorElimination.type,
    });
  }

  async saveSurvivorElimination(
    survivor: SeasonSurvivor,
    seasonId: SeasonsAttributes['seasonId'],
    transaction?: Transaction
  ) {
    const survivorElimination = survivor.getSurvivorEliminationStatus();

    if (survivorElimination.getIsTorchSnuffed() === true) {
      await this.survivorEliminationRepository.saveSurvivorElimination(
        {
          seasonId: seasonId,
          episodeId: survivorElimination.getEpisodeIdEliminated()!,
          day: survivorElimination.getDay()!,
          survivorId: survivor.getAttributes().id,
          notes: survivorElimination.getNotes(),
          seq: survivorElimination.getSeq()!,
          placement: survivorElimination.getPlacement()!,
          juryPlacement: survivorElimination.getJuryPlacement(),
          type: survivorElimination.getType()!,
        },
        transaction
      );

      await this.tribeMemberRepository.saveTribeMemberElimination(
        {
          episodeIdEnd: survivorElimination.getEpisodeIdEliminated()!,
          survivorId: survivor.getAttributes().id,
          seasonId: seasonId,
        },
        transaction
      );
    }
  }
}

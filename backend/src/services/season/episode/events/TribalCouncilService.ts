import { inject, injectable } from 'tsyringe';
import { TribalCouncil } from '../../../../domain/season/episode/events/TribalCouncil';
import { Transaction } from 'sequelize';
import { TribalCouncilRepository } from '../../../../repositories/season/episode/events/TribalCouncilRepository';
import { Episode } from '../../../../domain/season/episode/Episode';
import { SeasonStorage } from '../../../../domain/season/Season';
import { Tribe } from '../../../../domain/season/tribe/Tribe';
import { SeasonEliminationRepository } from '../../../../repositories/season/survivor/SeasonEliminationRepository';

@injectable()
export class TribalCouncilService {
  constructor(
    @inject(TribalCouncilRepository)
    private tribalCouncilRepository: TribalCouncilRepository,
    @inject(SeasonEliminationRepository)
    private seasonEliminationRepository: SeasonEliminationRepository,
    @inject(SeasonStorage)
    private seasonStorage: SeasonStorage
  ) {}

  async fetchTribalCouncilEventsOnEpisode(episode: Episode) {
    const episodeId = episode.getAttributes().id;
    const tribalCouncilsData =
      await this.tribalCouncilRepository.findTribalCouncilsByEpisodeId(
        episodeId
      );

    const tribalCouncils: TribalCouncil[] = [];
    for (const tribalCouncilData of tribalCouncilsData) {
      const attendingSurvivors = tribalCouncilData.survivors.map(
        (survivorData) => {
          return this.seasonStorage
            .getSeason(episode.getAttributes().seasonId)
            .getSurvivorById(survivorData.survivorId);
        }
      );

      const attendingTribe: Tribe | null = tribalCouncilData.attendingTribeId
        ? this.seasonStorage
            .getSeason(episode.getAttributes().seasonId)
            .getTribeById(tribalCouncilData.attendingTribeId)
        : null;

      const eliminatedSurvivor = this.seasonStorage
        .getSeason(episode.getAttributes().seasonId)
        .getSurvivorById(tribalCouncilData.elimination.survivorId);

      const tribalCouncil = new TribalCouncil({
        id: tribalCouncilData.id,
        day: tribalCouncilData.day,
        attendingTribe,
        episodeId: tribalCouncilData.episodeId,
        attendingSurvivors: attendingSurvivors,
        eliminatedSurvivor,
        seq: tribalCouncilData.seq,
      });
      tribalCouncils.push(tribalCouncil);
      episode.getEpisodeEvents().addTribalCouncil(tribalCouncil);
    }
    return tribalCouncils;
  }

  private async saveTribalCouncil(
    tribalCouncil: TribalCouncil,
    transaction: Transaction
  ): Promise<void> {
    await this.tribalCouncilRepository.saveTribalCouncilAttributes(
      tribalCouncil.getAttributes(),
      transaction
    );
    await this.seasonEliminationRepository.saveEliminationAttributes(
      {
        juryPlacement: null,
        placement: 1,
        tribalCouncilId: tribalCouncil.getAttributes().id,
        survivorId: tribalCouncil.getEliminatedSurvivor().getAttributes().id,
        seasonId: tribalCouncil.getEliminatedSurvivor().getAttributes()
          .seasonId,
      },
      transaction
    );
  }

  async saveTribalCouncilsOnEpisode(
    tribalCouncils: TribalCouncil[],
    transaction: Transaction
  ): Promise<void> {
    for (const tribalCouncil of tribalCouncils) {
      await this.saveTribalCouncil(tribalCouncil, transaction);
    }
  }
}

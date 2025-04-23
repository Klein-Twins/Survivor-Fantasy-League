import { container, inject, injectable } from 'tsyringe';
import { TribeAttributes } from '../../../models/season/Tribes';
import { Tribe } from '../../../domain/season/tribe/Tribe';
import { SeasonStorage } from '../../../domain/season/Season';
import { Transaction } from 'sequelize';
import { TribeRepository } from '../../../repositories/season/tribe/TribeRepository';

@injectable()
export class TribeService {
  constructor(
    @inject(TribeRepository) private tribeRepository: TribeRepository,
    @inject(SeasonStorage) private seasonStorage: SeasonStorage
  ) {}

  async fetchTribeByTribeId(tribeId: TribeAttributes['id']): Promise<Tribe> {
    const tribeAttributes = await this.tribeRepository.findTribeById(tribeId);

    if (!tribeAttributes) {
      throw new Error(`Tribe with ID ${tribeId} not found`);
    }

    const season = this.seasonStorage.getSeason(tribeAttributes.seasonId);
    const episodeStart = season.getEpisodeById(tribeAttributes.episodeIdStart);
    const episodeEnd = tribeAttributes.episodeIdEnd
      ? season.getEpisodeById(tribeAttributes.episodeIdEnd)
      : null;

    const tribe = new Tribe({
      id: tribeAttributes.id,
      name: tribeAttributes.name,
      color: tribeAttributes.color,
      hexColor: tribeAttributes.hexColor,
      mergeTribe: tribeAttributes.mergeTribe,
      seasonId: tribeAttributes.seasonId,
      episodeStart: episodeStart,
      episodeEnd: episodeEnd,
    });

    this.seasonStorage.getSeason(tribeAttributes.seasonId).addTribe(tribe);

    return tribe;
  }

  async fetchTribesBySeasonId(
    seasonId: TribeAttributes['seasonId']
  ): Promise<Tribe[]> {
    const tribeIdsInSeason = await this.tribeRepository.findTribeIdsInSeason(
      seasonId
    );

    const tribes: Tribe[] = [];

    for (const tribeId of tribeIdsInSeason) {
      const tribe = await this.fetchTribeByTribeId(tribeId);
      tribes.push(tribe);
    }

    return tribes;
  }

  async saveTribe(tribe: Tribe, transaction: Transaction) {
    await this.tribeRepository.saveTribeAttributes(
      {
        ...tribe.getAttributes(),
        episodeIdEnd: tribe.episodeEnd?.getAttributes().id || null,
        episodeIdStart: tribe.episodeStart.getAttributes().id,
      },
      transaction
    );
  }
}

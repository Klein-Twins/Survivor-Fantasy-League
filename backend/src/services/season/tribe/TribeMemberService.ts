import { inject, injectable } from 'tsyringe';
import { TribeStart } from '../../../domain/season/episode/events/TribeStart';
import { Transaction } from 'sequelize';
import { TribeMemberAttributes } from '../../../models/season/TribeMembers';
import { Tribe } from '../../../domain/season/tribe/Tribe';
import { SeasonStorage } from '../../../domain/season/Season';
import { Episode } from '../../../domain/season/episode/Episode';
import { TribeMemberRepository } from '../../../repositories/season/tribe/TribeMemberRepository';
import { TribeMemberRosterOnEpisode } from '../../../domain/season/tribe/TribeMemberRoster';
import { TribeHelper } from '../../../helpers/season/tribe/TribeHelper';

@injectable()
export class TribeMemberService {
  constructor(
    @inject(TribeMemberRepository)
    private tribeMemberRepository: TribeMemberRepository,
    @inject(SeasonStorage)
    private seasonStorage: SeasonStorage,
    @inject(TribeHelper)
    private tribeHelper: TribeHelper
  ) {}

  async fetchTribeMemberRosterOnEpisode(
    tribe: Tribe,
    episode: Episode
  ): Promise<TribeMemberRosterOnEpisode> {
    const tribeId = tribe.getAttributes().id;
    const episodeId = episode.getAttributes().id;

    const season = this.seasonStorage.getSeason(tribe.getAttributes().seasonId);

    const episodeStartSurvivorIds =
      await this.tribeMemberRepository.getSurvivorIdsInTribeAtEpisodeStart(
        tribeId,
        episodeId
      );
    const episodeStartSurvivors = season.getSurvivorsByIds(
      episodeStartSurvivorIds
    );

    const episodeEndSurvivorIds =
      await this.tribeMemberRepository.getSurvivorIdsInTribeAtEpisodeEnd(
        tribeId,
        episodeId
      );
    const episodeEndSurvivors = season.getSurvivorsByIds(episodeEndSurvivorIds);

    const episodeTribalCouncilSurvivorIds =
      await this.tribeMemberRepository.getSurvivorIdsInTribeAtEpisodeTribal(
        tribeId,
        episodeId
      );
    const episodeTribalCouncilSurvivors = season.getSurvivorsByIds(
      episodeTribalCouncilSurvivorIds
    );

    return {
      episodeStart: episodeStartSurvivors,
      episodeEnd: episodeEndSurvivors,
      episodeTribalCouncil: episodeTribalCouncilSurvivors,
    };
  }

  async fetchTribeMemberRoster(tribe: Tribe) {
    const episodesInSeason = this.seasonStorage
      .getSeason(tribe.getAttributes().seasonId)
      .getEpisodes();

    const tribeMemberRoster = tribe.getTribeMemberRoster();

    for (const episode of episodesInSeason) {
      const isTribeActiveOnEpisode = this.tribeHelper.isTribeActiveOnEpisode(
        tribe,
        episode
      );
      if (!isTribeActiveOnEpisode) {
        continue;
      }

      const tribeMemberRosterOnEpisode =
        await this.fetchTribeMemberRosterOnEpisode(tribe, episode);

      tribeMemberRoster.addTribeMembers(
        episode.getAttributes().id,
        'episodeStart',
        tribeMemberRosterOnEpisode.episodeStart
      );
      tribeMemberRoster.addTribeMembers(
        episode.getAttributes().id,
        'episodeEnd',
        tribeMemberRosterOnEpisode.episodeEnd
      );
      tribeMemberRoster.addTribeMembers(
        episode.getAttributes().id,
        'episodeTribalCouncil',
        tribeMemberRosterOnEpisode.episodeTribalCouncil
      );
    }
  }

  async saveTribeStartTribeMembers(
    tribeStart: TribeStart,
    transaction: Transaction
  ) {
    const tribe = tribeStart.getTribe();
    const tribeMembersAtEpisodeStart = tribe.getTribeMemberRosterOnEpisode(
      tribe.getEpisodeStart().getAttributes().id
    ).episodeStart;

    const tribeMembersAttributes: TribeMemberAttributes[] =
      tribeMembersAtEpisodeStart.map((tribeMember) => {
        return {
          tribeId: tribe.getAttributes().id,
          survivorId: tribeMember.getAttributes().id,
          episodeIdStart: tribe.getEpisodeStart().getAttributes().id,
          episodeIdEnd: null,
          notes: null,
        };
      });
    await this.tribeMemberRepository.saveTribeStartMembers(
      tribeMembersAttributes,
      transaction
    );
  }

  private async saveTribeSwitch(
    tribe: Tribe,
    episode: Episode,
    transaction: Transaction
  ) {
    const tribeMembersInTribeAfterTribeSwitch =
      tribe.getTribeMemberRosterOnEpisode(
        episode.getAttributes().id
      ).episodeTribalCouncil;
    const tribeMembersAttributes: TribeMemberAttributes[] =
      tribeMembersInTribeAfterTribeSwitch.map((tribeMember) => {
        return {
          tribeId: tribe.getAttributes().id,
          survivorId: tribeMember.getAttributes().id,
          episodeIdStart: episode.getAttributes().id,
          episodeIdEnd: null,
          notes: null,
        };
      });
    await this.tribeMemberRepository.saveTribeSwitch(
      tribeMembersAttributes,
      episode.getAttributes().id,
      transaction
    );
  }
  async saveTribeSwitches(
    tribes: Tribe[],
    episode: Episode,
    transaction: Transaction
  ) {
    for (const tribe of tribes) {
      await this.saveTribeSwitch(tribe, episode, transaction);
    }
  }
}

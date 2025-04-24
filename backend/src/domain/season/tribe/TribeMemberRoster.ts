import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SeasonSurvivor } from '../survivor/SeasonSurvivor';

export type TribeMemberRosterOnEpisode = {
  episodeStart: SeasonSurvivor[];
  episodeTribalCouncil: SeasonSurvivor[];
  episodeEnd: SeasonSurvivor[];
};

export class TribeMemberRoster {
  private tribeMemberState: Map<
    EpisodeAttributes['id'],
    TribeMemberRosterOnEpisode
  >;

  constructor() {
    this.tribeMemberState = new Map<
      EpisodeAttributes['id'],
      TribeMemberRosterOnEpisode
    >();
  }

  private initializeEpisodeState(episodeId: EpisodeAttributes['id']): void {
    if (!this.tribeMemberState.has(episodeId)) {
      this.tribeMemberState.set(episodeId, {
        episodeStart: [],
        episodeTribalCouncil: [],
        episodeEnd: [],
      });
    }
  }

  private checkNoSurvivorRepeats(
    episodeId: EpisodeAttributes['id'],
    phase: keyof TribeMemberRosterOnEpisode,
    tribeMember: SeasonSurvivor
  ): void {
    const episodeState = this.tribeMemberState.get(episodeId);
    if (episodeState) {
      const existingMembers = episodeState[phase];
      const isSurvivorInRoster = existingMembers.some(
        (member) => member.getAttributes().id === tribeMember.getAttributes().id
      );
      if (isSurvivorInRoster) {
        throw new Error(
          `Survivor ${
            tribeMember.getAttributes().nickName
          } is already in the ${phase} roster for episode ${episodeId}`
        );
      }
    }
  }

  private addTribeMembersInternal(
    episodeId: EpisodeAttributes['id'],
    phase: keyof TribeMemberRosterOnEpisode,
    tribeMembers: SeasonSurvivor[]
  ): void {
    this.initializeEpisodeState(episodeId);
    const episodeState = this.tribeMemberState.get(episodeId)!;

    for (const tribeMember of tribeMembers) {
      this.checkNoSurvivorRepeats(episodeId, phase, tribeMember);
      episodeState[phase].push(tribeMember);
      episodeState[phase] = episodeState[phase].sort((a, b) => {
        const firstNameA = a.getAttributes().firstName.toLowerCase();
        const firstNameB = b.getAttributes().firstName.toLowerCase();

        if (firstNameA < firstNameB) {
          return -1;
        }
        if (firstNameA > firstNameB) {
          return 1;
        }
        return 0;
      });
    }
  }

  public addTribeMember(
    episodeId: EpisodeAttributes['id'],
    phase: keyof TribeMemberRosterOnEpisode,
    tribeMember: SeasonSurvivor
  ): void {
    this.addTribeMembersInternal(episodeId, phase, [tribeMember]);
  }

  public addTribeMembers(
    episodeId: EpisodeAttributes['id'],
    phase: keyof TribeMemberRosterOnEpisode,
    tribeMembers: SeasonSurvivor[]
  ): void {
    this.addTribeMembersInternal(episodeId, phase, tribeMembers);
  }

  public getTribeMemberState(
    episodeId: EpisodeAttributes['id']
  ): TribeMemberRosterOnEpisode {
    const tribeMemberState = this.tribeMemberState.get(episodeId);
    if (!tribeMemberState) {
      throw new Error(`No tribe member state found for episode ${episodeId}`);
    }
    return tribeMemberState;
  }
}

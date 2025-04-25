import { ChallengeAttributes } from '../../../../models/season/challenges/Challenges';
import { ChallengeWinnersAttributes } from '../../../../models/season/challenges/ChallengeWinners';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import { TribalCouncilAttributes } from '../../../../models/season/tribalCouncil/TribalCouncil';
import { TribeAttributes } from '../../../../models/season/Tribes';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';

// export type Episode = {
//   episodeInfo: SeedEpisodeInfo;
//   episodeEvents: SeedEpisodeEvents | null;
// };

// export type Episodes = Map<number, Episode>;

// export type EpisodeInfo = Pick<
//   EpisodeAttributes,
//   'id' | 'title' | 'airDate' | 'description' | 'type' | 'number'
// >;

// export type TribeSwitch = {
//   survivorId: SurvivorsAttributes['id'];
//   tribeId: TribeAttributes['id'];
// }[];

// export type Challenges = Challenge[];

// export type Challenge = Omit<ChallengeAttributes, 'episodeId'> & {
//   results: Omit<ChallengeWinnersAttributes, 'challengeId'>[];
// };

// export type SurvivorEliminationEvent = SurvivorElimination[];

// export type SurvivorElimination = Omit<
//   SeasonEliminationAttributes,
//   'seasonId' | 'episodeId'
// >;

// // export type Tribes<T extends string | number | symbol> = Map<T, StartingTribe>;

// // export type StartingTribe = Omit<TribeAttributes, 'seasonId'> &
// //   startingTribeMembers;

// // export type startingTribeMembers = {
// //   startingSurvivors: SurvivorsAttributes['id'][];
// // };

// export type EpisodeEvents = {
//   tribeSwitch?: TribeSwitch;
//   isMerge?: boolean;
//   challenges: Challenges;
//   survivorEliminationEvent: SurvivorEliminationEvent;
//   fireChallenge?: FireChallenge;
//   tribeStart?: TribeStartEvent;
//   mergeStart?: TribeStartEvent;
// };

// //export type TribeStartEvent = TribeAttributes['id'][];

// export type TribeStartEvent = TribeStart[];

// export type TribeStart = Omit<
//   TribeAttributes,
//   'seasonId' | 'episodeIdStart' | 'episodeIdEnd' | 'mergeTribe'
// > & {
//   startingSurvivors: SurvivorsAttributes['id'][];
// };

// export type FireChallenge = FireChallengeParicipant[];
// type FireChallengeParicipant = {
//   survivor: SurvivorsAttributes['id'];
//   winner: boolean;
// };

// export type SeasonData = SeasonsAttributes & {
//   // tribes: Tribes<T>; // Pass the generic type `T` to `Tribes`
//   episodes: Episodes;
// };

export type SeedSeasonData = SeasonsAttributes & {
  episodes: SeedEpisodes;
};

export type SeedEpisodes = Map<number, SeedEpisode>;

export type SeedEpisode = {
  episodeInfo: SeedEpisodeInfo;
  episodeEvents?: SeedEpisodeEvents;
};

export type SeedEpisodeInfo = Pick<
  EpisodeAttributes,
  'id' | 'title' | 'airDate' | 'description' | 'type' | 'number'
>;

export type SeedEpisodeEvents = {
  tribalCouncil?: SeedTribalCouncilEpisodeEvent;
  tribeSwitch?: SeedTribeSwitch;
  tribeStart?: SeedTribeStartEpisodeEvent;
};

export type SeedTribeSwitch = {
  survivorId: SurvivorsAttributes['id'];
  tribeId: TribeAttributes['id'];
}[];

export type SeedTribalCouncilEpisodeEvent = SeedTribalCouncil[];
export type SeedTribalCouncil =
  | (Omit<TribalCouncilAttributes, 'episodeId' | 'attendingTribeId'> & {
      attendingTribeId: TribeAttributes['id'];
      attendingSurvivorIds: null;
      eliminatedSurvivorId: SurvivorsAttributes['id'];
    })
  | (Omit<TribalCouncilAttributes, 'episodeId' | 'attendingTribeId'> & {
      attendingTribeId: null;
      attendingSurvivorIds: SurvivorsAttributes['id'][];
      eliminatedSurvivorId: SurvivorsAttributes['id'];
    });

export type SeedTribeStartEpisodeEvent = SeedTribeStart[];
export type SeedTribeStart = Omit<
  TribeAttributes,
  'seasonId' | 'episodeIdStart' | 'episodeIdEnd' | 'mergeTribe'
> & {
  startingSurvivors: SurvivorsAttributes['id'][];
};

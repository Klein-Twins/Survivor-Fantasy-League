import { ChallengeAttributes } from '../../../../models/season/challenges/Challenges';
import { ChallengeWinnersAttributes } from '../../../../models/season/challenges/ChallengeWinners';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import { TribeAttributes } from '../../../../models/season/Tribes';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';

export type Episode = {
  episodeInfo: EpisodeInfo;
  episodeEvents?: EpisodeEvents;
};

export type Episodes = Map<number, Episode>;

export type EpisodeInfo = Pick<
  EpisodeAttributes,
  'id' | 'title' | 'airDate' | 'description' | 'type' | 'number'
>;

export type TribeSwitch = {
  survivorId: SurvivorsAttributes['id'];
  tribeId: TribeAttributes['id'];
}[];

export type Challenges = Challenge[];

export type Challenge = Omit<ChallengeAttributes, 'episodeId'> & {
  results: Omit<ChallengeWinnersAttributes, 'challengeId'>[];
};

export type EliminatedSurvivors = EliminatedSurvivor[];

export type EliminatedSurvivor = Omit<
  SeasonEliminationAttributes,
  'seasonId' | 'episodeId'
>;

export type Tribes<T extends string | number | symbol> = Map<T, StartingTribe>;

export type StartingTribe = Omit<TribeAttributes, 'seasonId'> &
  startingTribeMembers;

export type startingTribeMembers = {
  startingSurvivors: SurvivorsAttributes['id'][];
};

export type EpisodeEvents = {
  tribeSwitch?: TribeSwitch;
  isMerge?: boolean;
  challenges: Challenges;
  eliminatedSurvivors: EliminatedSurvivors;
  fireChallenge?: FireChallenge;
};

export type FireChallenge = FireChallengeParicipant[];
type FireChallengeParicipant = {
  survivor: SurvivorsAttributes['id'];
  winner: boolean;
};

export type SeasonData<T extends string | number | symbol> =
  SeasonsAttributes & {
    tribes: Tribes<T>; // Pass the generic type `T` to `Tribes`
    episodes: Episodes;
  };

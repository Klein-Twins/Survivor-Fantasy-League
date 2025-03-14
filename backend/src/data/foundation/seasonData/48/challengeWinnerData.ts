import {
  ChallengeWinnersAttributes,
  ChallengeWinnerType,
} from '../../../../models/season/challenges/ChallengeWinners';
import { season48ChallengeIds, season48TribeIds } from '../../foundationIds';

export const season48ChallengeWinnersData: ChallengeWinnersAttributes[] = [
  //Episode 1 Reward Challenge
  {
    challengeId: season48ChallengeIds.episode1.reward1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Lagi,
    rank: 1,
    reward: 'Pot, machete, and flint',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },
  {
    challengeId: season48ChallengeIds.episode1.reward2,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Vula,
    rank: 2,
    reward: 'Pot, machete, and flint',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },
  {
    challengeId: season48ChallengeIds.episode1.rewardAndImmunity1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Lagi,
    rank: 1,
    reward: 'Large shelter-building kit',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },
  {
    challengeId: season48ChallengeIds.episode1.rewardAndImmunity1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Civa,
    rank: 2,
    reward: 'Smaller toolkit',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },

  //Episode 2
  {
    challengeId: season48ChallengeIds.episode2.rewardAndImmunity1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Civa,
    rank: 1,
    reward: 'Large fishing kit',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },
  {
    challengeId: season48ChallengeIds.episode2.rewardAndImmunity1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Lagi,
    rank: 2,
    reward: 'Small fishing kit',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },

  //Episode 3
  {
    challengeId: season48ChallengeIds.episode3.rewardAndImmunity1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Lagi,
    rank: 1,
    reward: 'Large comfort kit',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },
  {
    challengeId: season48ChallengeIds.episode3.rewardAndImmunity1,
    winnerSurvivorId: null,
    winnerTribeId: season48TribeIds.Civa,
    rank: 2,
    reward: 'Small tarp',
    winnerType: ChallengeWinnerType.Tribe,
    winnerNotes: null,
  },
];

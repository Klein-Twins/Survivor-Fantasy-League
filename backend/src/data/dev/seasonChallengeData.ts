import { UUID } from 'crypto';
import { ChallengeAttributes, ChallengeType } from '../../models/season/SSN_CHALLENGES';
import { season47EpisodeIds } from '../foundation/seasonData';

interface EpisodeChallengeMap {
  episode1: { immunity1: UUID; reward1: UUID };
  episode2: { immunity1: UUID; reward1: UUID };
  episode3: { immunity1: UUID; reward1: UUID };
  episode4: { immunity1: UUID; reward1: UUID };
  episode5: { immunity1: UUID; reward1: UUID };
  episode6: { immunity1: UUID; reward1: UUID };
  episode7: { immunity1: UUID; reward1: UUID };
  episode8: { immunity1: UUID; reward1: UUID };
  episode9: { immunity1: UUID; reward1: UUID };
  episode10: { immunity1: UUID; reward1: UUID };
  episode11: { immunity1: UUID };
  episode12: { immunity1: UUID; reward1: UUID };
  episode13: { immunity1: UUID; reward1: UUID; immunity2: UUID };
  episode14: { immunity1: UUID };
}
export const season47ChallengeIds: EpisodeChallengeMap = {
  episode1: {
    reward1: '09114b63-7941-40b7-85ee-db89bf8438cf',
    immunity1: '28438a4b-3666-4d1e-8dff-41cc73c63285',
  },
  episode2: {
    reward1: 'a9471169-6a71-4b29-aa8d-6470f2b686f8',
    immunity1: '81576864-e971-4d5e-8bbf-c2cb634bbaf6',
  },
  episode3: {
    reward1: 'a38e1798-13af-42c8-8392-7cfc4c4d296f',
    immunity1: '632933ec-87dd-405e-a0d2-8bd352fa75e2',
  },
  episode4: {
    reward1: 'b209441e-6a21-44f3-8ede-3671fd965847',
    immunity1: 'c6ff9755-f5a4-4387-bcac-876d73c7246a',
  },
  episode5: {
    reward1: '5fc91b53-fb5c-4a7c-8942-5d92f58c53b2',
    immunity1: '21edb35b-1689-47fc-b5f4-1c751fe0a748',
  },
  episode6: {
    reward1: '3c7f60bf-f888-45ec-ba23-f4c3ee8dfc90',
    immunity1: '54fbca41-57d4-4aa6-8acf-a2f5c6d67db8',
  },
  episode7: {
    reward1: '69b26f2a-278f-48ab-a8df-45e7e404d137',
    immunity1: 'e4efa51f-9cfb-42d4-926c-e1fa85697924',
  },
  episode8: {
    reward1: '10dcf732-931e-41ab-88c0-d19d0744cd88',
    immunity1: '2646cd3e-ae7c-4da4-a380-a22ec8239786',
  },
  episode9: {
    reward1: 'b2ae9c4d-5d4c-4df5-ad9c-e03f92a388d9',
    immunity1: '7d9146cb-7332-44ed-821d-cab44dc7f366',
  },
  episode10: {
    reward1: '8dc3555c-71b0-4cae-8997-a13dacaf92a7',
    immunity1: '895c2be0-2f0e-48ab-bc25-c03b26758c8f',
  },
  episode11: {
    immunity1: '02a05697-9ca3-4655-9b44-17f5eaa7abd2',
  },
  episode12: {
    reward1: 'fa8e51f6-4118-485c-8b04-8e970d55e3fd',
    immunity1: 'd9f665e9-ef30-4696-845e-24ff4b12968c',
  },
  episode13: {
    reward1: '33f922a2-4724-4874-abc5-a1aa0a00a2fa',
    immunity1: '2154cc2a-5b0e-4eb8-99fb-8b1687ab748e',
    immunity2: 'fc1eb03c-9e89-464a-a6a3-2f27d47b290d',
  },
  episode14: {
    immunity1: 'aa601145-263d-4e72-8ea1-7165464f649a',
  },
};

export const season47Challenges: ChallengeAttributes[] = [
  //Episode 1 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode1.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode1,
    type: ChallengeType.REWARD,
  },
  //Episode 1 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode1.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode1,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 2 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode2.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode2,
    type: ChallengeType.REWARD,
  },

  //Episode 2 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode2.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode2,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 3 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode3.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode3,
    type: ChallengeType.REWARD,
  },
  //Episode 3 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode3.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode3,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 4 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode4.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode4,
    type: ChallengeType.REWARD,
  },
  //Episode 4 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode4.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode4,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 5 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode5.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode5,
    type: ChallengeType.REWARD,
  },
  //Episode 5 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode5.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode5,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 6 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode6.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode6,
    type: ChallengeType.REWARD,
  },
  //Episode 6 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode6.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode6,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 7 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode7.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode7,
    type: ChallengeType.REWARD,
  },
  //Episode 7 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode7.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode7,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 8 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode8.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode8,
    type: ChallengeType.REWARD,
  },
  //Episode 8 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode8.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode8,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 9 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode9.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode9,
    type: ChallengeType.REWARD,
  },
  //Episode 9 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode9.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode9,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 10 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode10.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode10,
    type: ChallengeType.REWARD,
  },
  //Episode 10 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode10.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode10,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 11 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode11.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode11,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 12 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode12.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode12,
    type: ChallengeType.REWARD,
  },
  //Episode 12 Immunity Challenge
  {
    challengeId: season47ChallengeIds.episode12.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode12,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 13 Reward Challenge
  {
    challengeId: season47ChallengeIds.episode13.reward1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode13,
    type: ChallengeType.REWARD,
  },
  //Episode 13 Immunity Challenge 1
  {
    challengeId: season47ChallengeIds.episode13.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode13,
    type: ChallengeType.IMMUNITY,
  },
  //Episode 13 Immunity Challenge 2
  {
    challengeId: season47ChallengeIds.episode13.immunity2,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode13,
    type: ChallengeType.IMMUNITY,
  },

  //Episode 14 Immunity Challenge 1
  {
    challengeId: season47ChallengeIds.episode14.immunity1,
    description: null,
    notes: null,
    episodeId: season47EpisodeIds.episode14,
    type: ChallengeType.IMMUNITY,
  },
];

const seasonChallengeData = {
  season47Challenges,
};

export default seasonChallengeData;

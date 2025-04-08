import { EpisodeType } from '../../../../../generated-api';
import { ChallengeType } from '../../../../../models/season/challenges/Challenges';
import { ChallengeWinnerType } from '../../../../../models/season/challenges/ChallengeWinners';
import { TribeAttributes } from '../../../../../models/season/Tribes';
import { Episode, SeasonData, startingTribeMembers } from '../dataTypes';
import {
  season48ChallengeIds,
  season48SurvivorIds,
  season48TribeIds,
} from './ids';

const season48Episodes = new Map<number, Episode>([
  [
    1,
    {
      episodeInfo: {
        number: 1,
        id: '08a769c0-9e7f-49f6-a913-4a5061952b5d',
        title: 'THe Get to Know You Game',
        airDate: new Date('2025-02-26T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMIERE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season48SurvivorIds.StephanieBerger,
            day: 3,
            notes: '',
            seq: 1,
            placement: 18,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season48ChallengeIds.episode1.reward1,
            description: 'Marooning Challenge: Mud, Sweat and Precision',
            notes:
              'Each tribe formed 3 pairs. Each pair sprinted down the beach and crawled through a mud pit under a heavy cargo net and then ran to retrieve a heavy chest and carry it back to their mat before the next pair could go. After retrieving all three chests, three tribe members climbed a steep slide to the top of a platform. Using a pole they knocked off a key ring used to open the chest. They retrieved sandbags from the chest and tossed sand bags onto three small high platforms. The first tribe to land all three sandbags on the platforms won a pot, machete, and flint.',
            type: ChallengeType.REWARD,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 1,
                reward: 'Pot, machete, and flint',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
          {
            rank: 2,
            id: season48ChallengeIds.episode1.reward2,
            description: 'Supply Challenge: Water Supply',
            notes:
              'Following a buried rope that had a machete locked to the end, they used the machete to chop open a coconut to retrieve a key to unlock the machete. They then had to retrieve a pot from the top of a tall pole by any means possible. They filled the pot with seawater and used that to fill a large glass jug to float a key to the top that would unlock a flint. The one who unlocked the flint won the supplies. Kevin won when Kyle accidentally broke his jug. Kyle, in a demonstration of sportsmanship, then helped Kevin finish filling his bottle.',
            type: ChallengeType.REWARD,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Vula,
                rank: 2,
                reward: 'Pot, machete, and flint',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
          {
            rank: 3,
            id: season48ChallengeIds.episode1.rewardAndImmunity1,
            description: 'Supply Challenge: Water Supply',
            notes:
              'Following a buried rope that had a machete locked to the end, they used the machete to chop open a coconut to retrieve a key to unlock the machete. They then had to retrieve a pot from the top of a tall pole by any means possible. They filled the pot with seawater and used that to fill a large glass jug to float a key to the top that would unlock a flint. The one who unlocked the flint won the supplies. Kevin won when Kyle accidentally broke his jug. Kyle, in a demonstration of sportsmanship, then helped Kevin finish filling his bottle.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 1,
                reward: 'Large shelter-building kit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Civa,
                rank: 2,
                reward: 'Smaller toolkit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    2,
    {
      episodeInfo: {
        number: 2,
        id: '72c20456-e744-4b40-b3ed-e9dc00d391d9',
        title: 'Humble Traits',
        airDate: new Date('2025-03-05T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season48SurvivorIds.KevinLeung,
            day: 5,
            notes: '',
            seq: 1,
            placement: 17,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season48ChallengeIds.episode2.rewardAndImmunity1,
            notes:
              'Starting on a floating platform, one survivor climbed a ladder to the top of the platform and dove into the water to swim under a platform and released two buoys. They then placed the buoys in trays on the platform and then swam under a second platform and then over to a third platform. Once at the platform. The remaining survivors swam in pairs to the first platform and working together, transported the buoys over a balance beam. Once all players had reached the final platform with the buoys, they took turns shooting the buoys into a basket. The first two tribes to finish won immunity and a fishing kit.',
            description: 'Buoy Oh Buoy',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Civa,
                rank: 1,
                reward: 'Large fishing kit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 2,
                reward: 'Small fishing kit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    3,
    {
      episodeInfo: {
        number: 3,
        id: '4df12bba-1af8-4b7b-9583-17d7c7b61924',
        title: 'Committing to the Bit',
        airDate: new Date('2025-03-12T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            day: 7,
            survivorId: season48SurvivorIds.JustinPioppi,
            notes: '',
            seq: 1,
            placement: 16,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season48ChallengeIds.episode3.rewardAndImmunity1,
            description: 'Blind obstacle course with a sliding puzzle.',
            notes:
              'A caller for each tribe directed their three blindfolded tribemates around and through obstacles searching for three key bags that were used to unlock a slide puzzle. The caller then led the blindfolded members to the puzzle table and directed a still-blindfolded tribemate in solving the puzzle. The first two tribes to complete their puzzle won immunity and a large comfort kit for first place and a smaller tarp for second place.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 1,
                reward: 'Large comfort kit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Civa,
                rank: 2,
                reward: 'Small tarp',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    4,
    {
      episodeInfo: {
        number: 4,
        id: '1caf174c-25df-4d47-ba67-6b8e3ee51ed3',
        title: "The House Party's Over",
        airDate: new Date('2025-03-19T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            day: 9,
            survivorId: season48SurvivorIds.ThomasKrottinger,
            notes: '',
            seq: 1,
            placement: 15,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season48ChallengeIds.episode4.rewardAndImmunity1,
            description: 'Relay into a puzzle',
            notes:
              'Tribes must dig up and push a large timber cube to a station where one member will use blocks to build a goalpost, through which they must throw sandbags and land them on a barrel. Once two sandbags have been landed, the tribe will proceed to a puzzle station. Three tribe members will dig up a puzzle piece and work on building a temple puzzle. The first two tribes to complete their puzzle win.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 1,
                reward: 'Large amount of Fruit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Civa,
                rank: 2,
                reward: 'Small amount of fruit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
        ],
        tribeSwitch: [
          {
            tribeId: season48TribeIds.Vula,
            survivorId: season48SurvivorIds.KyleFraser,
          },
          {
            tribeId: season48TribeIds.Vula,
            survivorId: season48SurvivorIds.KamillaKarthigesu,
          },
          {
            tribeId: season48TribeIds.Lagi,
            survivorId: season48SurvivorIds.DavidKinne,
          },
          {
            tribeId: season48TribeIds.Lagi,
            survivorId: season48SurvivorIds.CharityNeims,
          },
          {
            tribeId: season48TribeIds.Vula,
            survivorId: season48SurvivorIds.ThomasKrottinger,
          },
          {
            tribeId: season48TribeIds.Vula,
            survivorId: season48SurvivorIds.ShauhinDavari,
          },
          {
            tribeId: season48TribeIds.Vula,
            survivorId: season48SurvivorIds.JoeHunter,
          },
          {
            tribeId: season48TribeIds.Civa,
            survivorId: season48SurvivorIds.BiancaRoses,
          },
          {
            tribeId: season48TribeIds.Civa,
            survivorId: season48SurvivorIds.SaiouniaHughley,
          },
          {
            tribeId: season48TribeIds.Civa,
            survivorId: season48SurvivorIds.CedrekMcFadden,
          },
          {
            tribeId: season48TribeIds.Lagi,
            survivorId: season48SurvivorIds.MaryZheng,
          },
        ],
      },
    },
  ],
  [
    5,
    {
      episodeInfo: {
        number: 5,
        id: '7526cc1f-74bc-4f79-9667-175ffa57915b',
        title: 'Master Class in Deception',
        airDate: new Date('2025-03-26T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            day: 11,
            survivorId: season48SurvivorIds.BiancaRoses,
            notes: '',
            seq: 1,
            placement: 14,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season48ChallengeIds.episode5.reward1,
            description: 'Enter Sandbag',
            notes:
              'Each tribe must hop over a series of tables, then pull a lever release sixty sandbags, which tribes will need to collect. Using the small sandbags, they will need to hit spinning targets to raise flags. The first tribe to raise all of their flags wins.',
            type: ChallengeType.REWARD,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 1,
                reward: 'Coffee and pastries at the Sanctuary',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Vula,
                rank: 2,
                reward: 'Smaller platter of pastries',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
          {
            rank: 2,
            id: season48ChallengeIds.episode5.immunity1,
            description: '48 Jump Street',
            notes: 'ASDFASFDFASFASFASDFASDFDSFDFASFFAFASFAFDASFASFSFASF',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Vula,
                rank: 1,
                reward: 'Large fishing kit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season48TribeIds.Lagi,
                rank: 2,
                reward: 'Small fishing kit',
                winnerType: ChallengeWinnerType.Tribe,
                winnerNotes: null,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    6,
    {
      episodeInfo: {
        number: 6,
        id: '49b0d820-0dc4-4b3f-b158-bee4a6b4d4be',
        title: 'Doing the Damn Thing',
        airDate: new Date('2025-04-02T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            day: 13,
            survivorId: season48SurvivorIds.CharityNeims,
            notes: '',
            seq: 1,
            placement: 13,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season48ChallengeIds.episode6.reward1,
            description: 'Feel the Earn',
            notes:
              'The remaining castaways would divide into two teams of six. On go, two castaways at a time must make their way through a mud crawl, then one member at a time must make their way up and over beams while moving through wood shavings. Once all six team members make it through both obstacles, two team members must use poles to clear debris covering a bag, that two members on a platform have to pick up with a grappling hook. When a team gets their bag, all team members must go up and down the platform before making their way up a ramp before completing one final task. The first team that finishes their task wins and moves onto an individual challenge',
            type: ChallengeType.REWARD,
            results: [
              {
                winnerSurvivorId: season48SurvivorIds.ChrissySarnowsky,
                winnerTribeId: null,
                rank: 1,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: season48SurvivorIds.DavidKinne,
                winnerTribeId: null,
                rank: 2,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: season48SurvivorIds.KamillaKarthigesu,
                winnerTribeId: null,
                rank: 3,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: season48SurvivorIds.KyleFraser,
                winnerTribeId: null,
                rank: 4,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: season48SurvivorIds.MaryZheng,
                winnerTribeId: null,
                rank: 5,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: season48SurvivorIds.StarToomey,
                winnerTribeId: null,
                rank: 6,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes: null,
              },
              {
                winnerSurvivorId: season48SurvivorIds.SaiouniaHughley,
                winnerTribeId: null,
                rank: 7,
                reward: 'Feast and eligibility for immunity challenge',
                winnerType: ChallengeWinnerType.Survivors,
                winnerNotes:
                  'Sai advanced directly to the Immunity Challenge and automatically joined the winning team on reward for finding the advantage. :(',
              },
            ],
          },
          {
            rank: 2,
            id: season48ChallengeIds.episode6.immunity1,
            description: 'Over-Extended',
            notes:
              'Castaways must place either a wooden statue or a ball on top of a pole. At regular intervals, they will add another section of pole, making it harder to balance. If the object falls off, that person is eliminated. The last person with their statue or ball on top of the pole wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                winnerSurvivorId: season48SurvivorIds.KyleFraser,
                winnerTribeId: null,
                rank: 1,
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
                winnerNotes: null,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    7,
    {
      episodeInfo: {
        number: 7,
        id: 'f784594f-dc05-4637-a13d-226a383d18ca',
        title: 'Survivor Smack Talk',
        airDate: new Date('2025-04-09T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
    },
  ],
]);

export enum Season48Tribes {
  Civa = 'Civa',
  Lagi = 'Lagi',
  Vula = 'Vula',
}

export const season48: SeasonData<Season48Tribes> = {
  seasonId: 48,
  theme: 'The New Era 2.0',
  name: 'Survivor 48',
  location: 'Mamanuca Islands, Fiji',
  isActive: true,
  episodes: season48Episodes,
  startDate: season48Episodes.get(1)?.episodeInfo.airDate || null,
  endDate: null,
  tribes: new Map<
    Season48Tribes,
    Omit<TribeAttributes, 'seasonId'> & startingTribeMembers
  >([
    [
      Season48Tribes.Civa,
      {
        id: 'cac70173-4546-49f6-88db-513bd3baad99',
        name: 'Civa',
        color: 'Green',
        hexColor: '#008000',
        mergeTribe: false,
        episodeIdStart: season48Episodes.get(1)!.episodeInfo.id,
        episodeIdEnd: null,
        startingSurvivors: [
          season48SurvivorIds.CharityNeims,
          season48SurvivorIds.ChrissySarnowsky,
          season48SurvivorIds.DavidKinne,
          season48SurvivorIds.KyleFraser,
          season48SurvivorIds.MitchGuerra,
          season48SurvivorIds.KyleFraser,
        ],
      },
    ],
    [
      Season48Tribes.Lagi,
      {
        id: 'c1ae46fa-7ed0-489c-968c-b228a7870585',
        name: 'Lagi',
        color: 'Blue',
        hexColor: '#0000FF',
        mergeTribe: false,
        episodeIdStart: season48Episodes.get(1)!.episodeInfo.id,
        episodeIdEnd: null,
        startingSurvivors: [
          season48SurvivorIds.EvaErickson,
          season48SurvivorIds.JoeHunter,
          season48SurvivorIds.ShauhinDavari,
          season48SurvivorIds.StarToomey,
          season48SurvivorIds.ThomasKrottinger,
          season48SurvivorIds.BiancaRoses,
        ],
      },
    ],
    [
      Season48Tribes.Vula,
      {
        id: '56107769-c43c-4121-b553-164efc833fba',
        name: 'Vula',
        color: 'Orange',
        hexColor: '#FFA500',
        mergeTribe: false,
        episodeIdStart: season48Episodes.get(1)!.episodeInfo.id,
        episodeIdEnd: null,
        startingSurvivors: [
          season48SurvivorIds.CedrekMcFadden,
          season48SurvivorIds.JustinPioppi,
          season48SurvivorIds.KevinLeung,
          season48SurvivorIds.MaryZheng,
          season48SurvivorIds.SaiouniaHughley,
          season48SurvivorIds.StephanieBerger,
        ],
      },
    ],
  ]),
};

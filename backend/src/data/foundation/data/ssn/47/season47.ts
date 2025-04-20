import { EpisodeType } from '../../../../../generated-api';
import { ChallengeType } from '../../../../../models/season/challenges/Challenges';
import { ChallengeWinnerType } from '../../../../../models/season/challenges/ChallengeWinners';
import { TribeAttributes } from '../../../../../models/season/Tribes';
import { Episode, SeasonData } from '../dataTypes';
import {
  season47ChallengeIds,
  season47EpisodeIds,
  season47SurvivorIds,
  season47TribeIds,
} from './ids';

export enum Season47Tribes {
  Gata = 'Gata',
  Tuku = 'Tuku',
  Lavo = 'Lavo',
  Beka = 'Beka',
}

const season47Episodes = new Map<number, Episode>([
  [
    1,
    {
      episodeInfo: {
        number: 1,
        id: season47EpisodeIds.episode1,
        title: 'One Glorious and Perfect Episode',
        airDate: new Date('2024-09-18T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMIERE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.JonLovett,
            day: 3,
            notes: '',
            seq: 1,
            placement: 18,
          },
        ],

        challenges: [
          {
            id: season47ChallengeIds.episode1.reward1,
            description: 'Marooning Challenge',
            rank: 1,
            notes:
              'Tribes had to race out into the jungle, two members at a time, to retrieve heavy puzzle pieces. They then worked together to assemble a 3D puzzle. The first tribe to solve their puzzle won a pot, machete, and flint.',
            type: ChallengeType.REWARD,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Gata,
                rank: 1,
                reward: 'Pot, machete, and flint',
                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
            ],
          },
          {
            id: season47ChallengeIds.episode1.reward2,
            description: 'Supply Challenge',
            rank: 2,
            notes:
              'Transported to Monu Island, Aysha and TK had to find four keys scattered across the island. The keys opened a crate that held the supplies. TK earned the supplies for Tuku.',
            type: ChallengeType.REWARD,
            results: [
              {
                winnerSurvivorId: season47SurvivorIds.TerranFoster,
                winnerTribeId: null,
                rank: 1,
                reward: 'Supplies',
                winnerNotes: 'TK earned the supplies for Tuku.',
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
          {
            id: season47ChallengeIds.episode1.immunity1,
            description: 'Immunity Challenge',
            rank: 3,
            notes:
              'Tribes paddled a boat to shore, collecting three heavy chests along the way. They then pushed their chests across a track and used the puzzle pieces inside to assemble a large Survivor logo puzzle. The first two tribes to finish won immunity, plus a large shelter-building kit for first place and a smaller toolkit for second place, while the losing tribe had to forfeit their flint',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Lavo,
                rank: 1,
                reward: 'Large shelter-building kit',
                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
              {
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Tuku,
                rank: 2,
                reward: 'Smaller toolkit',
                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
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
        id: season47EpisodeIds.episode2,
        title: 'Epic Boss Girl Move',
        airDate: new Date('2024-09-25T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.TerranFoster,
            day: 5,
            notes: '',
            seq: 1,
            placement: 17,
          },
        ],
        challenges: [
          {
            id: season47ChallengeIds.episode2.immunity1,
            description: 'Rice race',
            rank: 1,
            notes:
              'Starting in the water, tribes will swim to a platform where they will retrieve a bag of rice. They will then have to get the bag of rice through a net obstacle before returning to shore. One tribe member will then release a key, which they will use to open a gate for the tribe to cross. One tribe member will then use a knife to open the bag of rice to retrieve one ball. Three tribe members will then work together using ropes to guide the ball through a snake maze. The first two tribes to land their ball in the hole at the end of the snake maze win.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Gata,
                reward: 'Large fishing gear kit',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
              {
                rank: 2,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Lavo,
                reward: 'Smaller fishing gear kit',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
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
        id: season47EpisodeIds.episode3,
        title: 'Belly of the Beast',
        airDate: new Date('2024-10-02T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.AyshaWelch,
            day: 7,
            notes: '',
            seq: 1,
            placement: 16,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode3.immunity1,
            description: 'Seahorse With No Name',
            notes:
              'Each tribe will send one member out to swim to a tower, climb it, and jump off of it into the water. They will then swim to and cross a balance beam before swimming to the final platform. The four remaining tribe members will then run the course in two pairs. Once all five members have reached the final platform, two tribe members will solve a seahorse jigsaw puzzle. The first two tribes to complete their puzzle win.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Gata,
                reward: 'Large tarp',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
              {
                rank: 2,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Tuku,
                reward: 'Small tarp',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
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
        id: season47EpisodeIds.episode4,
        title: 'Is That Blood in Your Hair?',
        airDate: new Date('2024-10-09T19:00:00-06:00'),
        description: '',
        type: EpisodeType.PREMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.KishanPatel,
            day: 8,
            notes: '',
            seq: 1,
            placement: 15,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode4.immunity1,
            description: 'Stage Presence',
            notes:
              'Tribes must push a large timber cube to a station where one member will use blocks to build a goalpost, through which they must throw sandbags and land them on a barrel. Once two sandbags have been landed, the tribe will proceed to a puzzle station. One member must then use the keys to unlock the puzzle platform, allowing two members to solve a fire jigsaw puzzle. The first two tribes to complete their puzzle win.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Gata,
                reward: 'Three hens',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
              {
                rank: 2,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Tuku,
                reward: '6 eggs',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
            ],
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
        id: season47EpisodeIds.episode5,
        title: 'The Scales be Tippin',
        airDate: new Date('2024-10-16T19:00:00-06:00'),
        type: EpisodeType.PREMERGE,
        description: '',
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.AnikaDhar,
            day: 10,
            notes: '',
            seq: 1,
            placement: 14,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode5.reward1,
            description: 'Climb Mate Change',
            notes:
              'Before the challenge, the tribes will be temporarily disbanded, with the remaining 14 castaways spread across two teams of seven. Players will crawl under an obstacle to untie a bag from the obstacle. Once all seven members have retrieved a bag, the team will work to release a ladder, which members will climb to release five bags from a post, each containing a ball. Five members must then each toss and land a ball in a receptacle, with each member having to start further from the target than the person before them. The first team to land all five balls wins.',
            type: ChallengeType.REWARD,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.CarolineVidmar,
                winnerTribeId: null,
                reward: 'Feast at the Santuary',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                reward: 'Feast at the Santuary',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                reward: 'Feast at the Santuary',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SamPhalen,
                winnerTribeId: null,

                winnerNotes: '',
                reward: 'Feast at the Santuary',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SueSmey,
                winnerTribeId: null,
                reward: 'Feast at the Santuary',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.TeenyChirichillo,
                winnerTribeId: null,
                reward: 'Feast at the Santuary',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.TiyanaHallums,
                winnerTribeId: null,
                reward: 'Feast at the Santuary',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode5.immunity1,
            description: 'Drag Race',
            notes:
              'Each tribe will race to a post, where one member will use a knife on a stick to cut through a rope. This will release coconuts, which the tribe will collect in a net, which they will then drag to a puzzle station. The tribe will then use the coconuts to knock down a block puzzle. Once the puzzle has been demolished, the tribe will race to reassemble it. The first two tribes to complete their puzzle win.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Tuku,
                reward: null,

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
              },
              {
                rank: 2,
                winnerSurvivorId: null,
                winnerTribeId: season47TribeIds.Lavo,
                reward: null,

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Tribe,
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
        id: season47EpisodeIds.episode6,
        title: 'Feel the FOMO',
        airDate: new Date('2024-10-23T19:00:00-06:00'),
        description: '',
        type: EpisodeType.TRIBELESS,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.RomeCooney,
            day: 12,
            notes: '',
            seq: 1,
            placement: 13,
          },
        ],
        isMerge: true,
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode6.reward1,
            description: 'Feel the Earn',
            notes:
              'The remaining castaways would divide into two teams of six. On go, two castaways at a time must make their way through a mud crawl, then one member at a time must make their way up and over beams while moving through wood shavings. Once all six team members make it through both obstacles, two team members must use poles to clear debris covering a bag, that two members on a platform have to pick up with a grappling hook. When a team gets their bag, all team members must go up and down the platform before making their way up a ramp before completing one final task. The first team that finishes their task wins and moves onto an individual challengeThe castaways will feast on a large buffet of food, including a whole pig, fruit, and vegetables.',
            type: ChallengeType.REWARD,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                reward:
                  'A feast and eligibility to compete in the immunity challenge',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                reward:
                  'A feast and eligibility to compete in the immunity challenge',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SamPhalen,
                winnerTribeId: null,
                reward:
                  'A feast and eligibility to compete in the immunity challenge',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SierraWright,
                winnerTribeId: null,
                reward:
                  'A feast and eligibility to compete in the immunity challenge',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SueSmey,
                winnerTribeId: null,
                reward:
                  'A feast and eligibility to compete in the immunity challenge',

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.TeenyChirichillo,
                winnerTribeId: null,
                reward:
                  'A feast and eligibility to compete in the immunity challenge',
                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivors,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode6.immunity1,
            description: 'Bow Diddley',
            notes:
              'Castaways must balance on a narrow beam while balancing a ball on a rounded bow. At predetermined intervals, they would move further down to a narrower part of the beam, making it harder to keep steady. If they drop their ball or fall off their beam, they would be out of the challenge. The last person standing wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                reward: null,

                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivor,
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
        id: season47EpisodeIds.episode7,
        title: 'Our Pick on Blast',
        airDate: new Date('2024-10-30T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.TiyanaHallums,
            day: 13,
            notes: '',
            seq: 1,
            placement: 12,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode7.immunity1,
            description: 'Audio Slave',
            notes:
              'Divided into two teams of six, each castaway will stand on a narrow balance beam while holding up a boom pole over their head with a ball balancing on a disc at the end of the pole. At regular intervals, the castaways will step forward to a narrower part of the beam. If they fall off the beam or their ball drops, they are out of the challenge. The team that outlasts every member of the other team wins reward and team immunity; the person who lasts the longest on the losing team wins individual immunity.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.AndyRueda,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Baby back rips, potato sald, corn on the cob, beer, and soft drinks',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.GenevieveMushaluk,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Baby back rips, potato sald, corn on the cob, beer, and soft drinks',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SamPhalen,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Baby back rips, potato sald, corn on the cob, beer, and soft drinks',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SierraWright,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Baby back rips, potato sald, corn on the cob, beer, and soft drinks',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SolomonYi,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Baby back rips, potato sald, corn on the cob, beer, and soft drinks',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.TeenyChirichillo,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Baby back rips, potato sald, corn on the cob, beer, and soft drinks',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 2,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Individual Immunity',
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    8,
    {
      episodeInfo: {
        number: 8,
        id: season47EpisodeIds.episode8,
        title: "He's All That",
        airDate: new Date('2024-11-06T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.SierraWright,
            day: 15,
            notes: '',
            seq: 1,
            placement: 11,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode8.reward1,
            description: 'Survivor Auction',
            notes:
              'Prior to the challenge, the castaways were instructed to search their camp for 40 bamboo tubes, each containing a different amount of cash. The castaways would use their collected cash to bid on food items during the auction. At the end of the auction, the castaway with the most money left will lose their vote at the next Tribal Council.',
            type: ChallengeType.REWARD,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SolomonYi,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Potato Chips & soft drinks',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 2,
                winnerSurvivorId: season47SurvivorIds.TeenyChirichillo,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Mac & Cheese',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 3,
                winnerSurvivorId: season47SurvivorIds.SierraWright,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Chips, Salsa, Guacamole, & Margarita',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 4,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Buffalo Wings, Celery, and Carrots',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 5,
                winnerSurvivorId: season47SurvivorIds.GabeOrtis,
                winnerTribeId: null,
                reward: 'Coconut',
                winnerNotes: '',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 6,
                winnerSurvivorId: season47SurvivorIds.SolomonYi,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Giant Apple Pie with Whipped Cream',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 7,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                winnerNotes: '',
                reward:
                  'Burger, Fries, Condiments, and Beer and a clue to a hidden immunity idol',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 8,
                winnerSurvivorId: season47SurvivorIds.GenevieveMushaluk,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Pastries',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 9,
                winnerSurvivorId: season47SurvivorIds.SamPhalen,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Breakfast',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 10,
                winnerSurvivorId: season47SurvivorIds.SueSmey,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Burritor & Iced Tea',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 11,
                winnerSurvivorId: season47SurvivorIds.CarolineVidmar,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Fish Eyes',
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 12,
                winnerSurvivorId: season47SurvivorIds.SierraWright,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'Peanut butter & Chocolate',
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode8.immunity1,
            description: 'Wrist Assured',
            notes:
              'Each castaway will hold on to a handle with a rope wrapped around it, connected to a bucket that contains 25% of their body weight before the game began. When they let go of the handle, the bucket would drop, eliminating them. The last man and woman remaining in the challenge win.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SueSmey,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
              {
                rank: 2,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    9,
    {
      episodeInfo: {
        number: 9,
        id: season47EpisodeIds.episode9,
        title: 'Nightmare Fuel',
        airDate: new Date('2024-11-13T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.SolomonYi,
            day: 16,
            notes: '',
            seq: 1,
            placement: 10,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode9.reward1,
            description: 'Pairy Feral',
            notes: `Before the challenge, the ten castaways paired themselves up into five teams. One at a time, each team member would crawl under an obstacle. They will then dig up a bundle of planks. The first three pairs to retrieve their planks would proceed to the next stage. At the next stage, each team will use their planks to solve a staircase puzzle. After climbing the staircase, they will race across a balance beam. The first two pairs to cross the balance beam and slide down to the finish mat will proceed to the final stage`,
            type: ChallengeType.REWARD,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.GabeOrtis,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'BLT Sandwiches',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'BLT Sandwiches',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 2,
                winnerSurvivorId: season47SurvivorIds.SolomonYi,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'BLT Sandwiches',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 2,
                winnerSurvivorId: season47SurvivorIds.TeenyChirichillo,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'BLT Sandwiches',
                winnerType: ChallengeWinnerType.Survivors,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode9.immunity1,
            description: 'Pairy Feral - Immunity round',
            notes:
              'In the final stage, the pairs disbanded and each player competed individually. They would brace themselves with their arms between two walls while standing barefoot on two footholds. Every 15 minutes, the castaways would move down to smaller footholds. When the castaways reached the fourth set of footholds, they would try to remain on them as long as they could. The last castaway still standing on the footholds wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.GabeOrtis,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    10,
    {
      episodeInfo: {
        number: 10,
        id: season47EpisodeIds.episode10,
        title: 'Loyal to the Soil',
        airDate: new Date('2024-11-20T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.GabeOrtis,
            day: 18,
            notes: '',
            seq: 1,
            placement: 9,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode10.reward1,
            description: 'Slither Me',
            notes:
              'The castaways are randomly divided into three teams of three. Their feet are tied together and their arms are bound to their sides. One at a time they must slither through the sand and push a ball over a series of mounds. Once all three balls have been retrieved, each member will push a ball across a long table, landing it in a receptacle at the end. The first team to land all three balls wins.',
            type: ChallengeType.REWARD,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'A visit to the santuary with wraps, salads and cake',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 2,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'A visit to the santuary with wraps, salads and cake',
                winnerType: ChallengeWinnerType.Survivors,
              },
              {
                rank: 3,
                winnerSurvivorId: season47SurvivorIds.SamPhalen,
                winnerTribeId: null,
                winnerNotes: '',
                reward: 'A visit to the santuary with wraps, salads and cake',
                winnerType: ChallengeWinnerType.Survivors,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode10.immunity1,
            description: 'Rollerball',
            notes:
              'Each castaway would have to stand on a small wooden log while balancing a ball on a wooden disk. At regular intervals, a ball would be added until each castaway would be balancing three balls. Should any of their balls fall off the disk or if they step off the log, the castaway would be out of the challenge. The last castaway to not drop a ball or step off the log would win.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.KyleOstwald,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    11,
    {
      episodeInfo: {
        number: 11,
        id: season47EpisodeIds.episode11,
        title: 'Flipping the Win Switch',
        airDate: new Date('2024-11-27T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.KyleOstwald,
            day: 20,
            notes: '',
            seq: 1,
            placement: 8,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode11.immunity1,
            description: 'A Bit Tipsy',
            notes:
              'The castaways must stack letter blocks in a tower on a wobbly platform. Simultaneously, they must pull on a rope to keep the platform balanced while retrieving their blocks. The first castaway to stack their blocks to spell "IMMUNITY" and return to the starting position wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    12,
    {
      episodeInfo: {
        number: 12,
        id: season47EpisodeIds.episode12,
        title: 'Operation: Italy',
        airDate: new Date('2024-12-04T19:00:00-06:00'),
        description: '',
        type: EpisodeType.POSTMERGE,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.CarolineVidmar,
            day: 22,
            notes: '',
            seq: 1,
            placement: 7,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode12.immunity1,
            description: 'Matt Finish',
            notes:
              'Castaways must race across a series of obstacles, collecting a bag of balls along the way. They must then attempt to land each ball on a narrow overhead perch, where one part of the perch is higher than the other. The first person to land two balls on the perch wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.SamPhalen,
                winnerTribeId: null,
                winnerNotes: 'Shared with Andy Rueda and Genevieve Mushaluk',
                reward:
                  'Pizza, pasta, margaritas, letters form home and an overnight stay at the Survivor Santuary',
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode12.immunity2,
            description: 'Wizards Staff',
            notes:
              'The castaways will first carry a ball on a pole over a teetering balance beam. They will then drop the pole and pick up a long pole with two blocks on each end; by maneuvering the pole through a wire maze, they will use the blocks to push two skulls across a long table. Once the skulls are free, the castaway will roll balls down to the end of a wooden board, attempting to land balls in any of five slots on the board. The first person to land three balls wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                winnerNotes: null,
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    13,
    {
      episodeInfo: {
        number: 13,
        id: season47EpisodeIds.episode13,
        title: 'Bob and Weave',
        airDate: new Date('2024-12-11T19:00:00-06:00'),
        description: '',
        type: EpisodeType.FINALE1,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.AndyRueda,
            day: 23,
            notes: '',
            seq: 1,
            placement: 6,
          },
          {
            survivorId: season47SurvivorIds.GenevieveMushaluk,
            day: 24,
            notes: '',
            seq: 1,
            placement: 5,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode13.reward1,
            description: 'Chasing Waterfalls',
            notes:
              'Throughout the numerous variations of this challenge, the primary goal involves moving an object (a tiki segment in Vanuatu, puzzle pieces in Heroes vs. Villains, or buoys) through a rope and across a series of obstacles to a finish. At the end, each team or each individual castaway may have to perform a secondary task (e.g. a puzzle or landing buoys in a hoop) to complete the challenge.',
            type: ChallengeType.REWARD_AND_IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.GenevieveMushaluk,
                winnerTribeId: null,
                reward: 'Steak and cheesecake at the Survivor Santuary',
                winnerNotes: 'Shared with Sue Smey and Teeny Chirichillo',
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
          {
            rank: 2,
            id: season47ChallengeIds.episode13.immunity2,
            description: 'Stacked Up',
            notes:
              'Starting in the ocean, the castaways must swim to shore, dig under a log, and get to a wobbly beam. Then, while standing on the beam, castaways must use a long fork to stack six sets of balls between stands on a free-standing structure. The first castaway to complete their stack wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
      },
    },
  ],
  [
    14,
    {
      episodeInfo: {
        number: 14,
        id: season47EpisodeIds.episode14,
        title: 'The Final Showdown',
        airDate: new Date('2024-12-18T19:00:00-06:00'),
        description: '',
        type: EpisodeType.FINALE2,
      },
      episodeEvents: {
        eliminatedSurvivors: [
          {
            survivorId: season47SurvivorIds.TeenyChirichillo,
            day: 25,
            notes: '',
            seq: 1,
            placement: 4,
          },
        ],
        challenges: [
          {
            rank: 1,
            id: season47ChallengeIds.episode14.immunity1,
            description: 'Suzi Quatro',
            notes:
              'Castaways must race through a series of physical and mental obstacles. The first tribe, team, or individual to complete the course wins.',
            type: ChallengeType.IMMUNITY,
            results: [
              {
                rank: 1,
                winnerSurvivorId: season47SurvivorIds.RachelLaMont,
                winnerTribeId: null,
                winnerNotes: '',
                reward: null,
                winnerType: ChallengeWinnerType.Survivor,
              },
            ],
          },
        ],
        fireChallenge: [
          { survivor: season47SurvivorIds.SamPhalen, winner: true },
          { survivor: season47SurvivorIds.TeenyChirichillo, winner: false },
        ],
      },
    },
  ],
]);

//  {
//   id: season47TribeIds.Beka,
//   name: 'Beka',
//   seasonId: 47,
//   tribeColor: 'Purple',
//   tribeHexColor: '#800080',
//   mergeTribe: true,
//   episodeStarted: season47EpisodeIds.episode7,
// },

export const season47: SeasonData<Season47Tribes> = {
  seasonId: 47,
  theme: 'The New Era 2.0',
  name: 'Survivor 47',
  location: 'Mamanuca Islands, Fiji',
  isActive: true,
  episodes: season47Episodes,
  startDate: season47Episodes.get(1)?.episodeInfo.airDate || null,
  endDate: null,
  // tribes: new Map<
  //   Season47Tribes,
  //   Omit<TribeAttributes, 'seasonId'> & startingTribeMembers
  // >([
  //   [
  //     Season47Tribes.Tuku,
  //     {
  //       id: season47TribeIds.Tuku,
  //       name: 'Civa',
  //       color: 'Green',
  //       hexColor: '#008000',
  //       mergeTribe: false,
  //       episodeIdStart: season47Episodes.get(1)!.episodeInfo.id,
  //       episodeIdEnd: null,
  //       startingSurvivors: [
  //         season47SurvivorIds.TerranFoster,
  //         season47SurvivorIds.TiyanaHallums,
  //         season47SurvivorIds.GabeOrtis,
  //         season47SurvivorIds.KyleOstwald,
  //         season47SurvivorIds.CarolineVidmar,
  //         season47SurvivorIds.SueSmey,
  //       ],
  //     },
  //   ],
  //   [
  //     Season47Tribes.Lavo,
  //     {
  //       id: season47TribeIds.Lavo,
  //       name: 'Lagi',
  //       color: 'Blue',
  //       hexColor: '#0000FF',
  //       mergeTribe: false,
  //       episodeIdStart: season47Episodes.get(1)!.episodeInfo.id,
  //       episodeIdEnd: null,
  //       startingSurvivors: [
  //         season47SurvivorIds.AyshaWelch,
  //         season47SurvivorIds.KishanPatel,
  //         season47SurvivorIds.RomeCooney,
  //         season47SurvivorIds.SolomonYi,
  //         season47SurvivorIds.GenevieveMushaluk,
  //         season47SurvivorIds.TeenyChirichillo,
  //       ],
  //     },
  //   ],
  //   [
  //     Season47Tribes.Gata,
  //     {
  //       id: season47TribeIds.Gata,
  //       name: 'Vula',
  //       color: 'Orange',
  //       hexColor: '#FFA500',
  //       mergeTribe: false,
  //       episodeIdStart: season47Episodes.get(1)!.episodeInfo.id,
  //       episodeIdEnd: season47Episodes.get(7)!.episodeInfo.id,
  //       startingSurvivors: [
  //         season47SurvivorIds.JonLovett,
  //         season47SurvivorIds.AnikaDhar,
  //         season47SurvivorIds.SierraWright,
  //         season47SurvivorIds.AndyRueda,
  //         season47SurvivorIds.SamPhalen,
  //         season47SurvivorIds.RachelLaMont,
  //       ],
  //     },
  //   ],
  //   [
  //     Season47Tribes.Beka,
  //     {
  //       id: season47TribeIds.Beka,
  //       name: 'Beka',
  //       color: 'Purple',
  //       hexColor: '#800080',
  //       mergeTribe: true,
  //       episodeIdStart: season47Episodes.get(7)!.episodeInfo.id,
  //       episodeIdEnd: null,
  //       startingSurvivors: [
  //         season47SurvivorIds.AndyRueda,
  //         season47SurvivorIds.CarolineVidmar,
  //         season47SurvivorIds.GabeOrtis,
  //         season47SurvivorIds.GenevieveMushaluk,
  //         season47SurvivorIds.KyleOstwald,
  //         season47SurvivorIds.RachelLaMont,
  //         season47SurvivorIds.SamPhalen,
  //         season47SurvivorIds.SierraWright,
  //         season47SurvivorIds.SolomonYi,
  //         season47SurvivorIds.SueSmey,
  //         season47SurvivorIds.TeenyChirichillo,
  //       ],
  //     },
  //   ],
  // ]),
};

export default season47;

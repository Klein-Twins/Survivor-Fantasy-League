import { SurvivorDetailsOnSeasonAttributes } from '../../../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';
import { season47SurvivorIds } from '../ssn/47/ids';
import { season48SurvivorIds } from '../ssn/48/ids';

type SurvivorDetailsOnSeason = Omit<
  SurvivorDetailsOnSeasonAttributes,
  'id' | 'originalTribeId' | 'seasonId'
>;

export type SurvivorData = SurvivorsAttributes & {
  seasonDetails: Map<number, SurvivorDetailsOnSeason>;
};

const survivorsData: SurvivorData[] = [
  {
    id: season47SurvivorIds.AndyRueda,
    firstName: 'Andy',
    nickName: null,
    lastName: 'Rueda',
    fromCity: 'Brooklyn',
    fromState: 'New York',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 31,
          description: '',
          job: 'AI Research Assistant',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.AnikaDhar,
    firstName: 'Anika',
    nickName: null,
    lastName: 'Dhar',
    fromCity: 'Los Angeles',
    fromState: 'California',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 26,
          description: '',
          job: 'Marketing Manager',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.AyshaWelch,
    firstName: 'Aysha',
    nickName: null,
    lastName: 'Welch',
    fromCity: 'Houston',
    fromState: 'Texas',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 32,
          description: '',
          job: 'Dont know',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.CarolineVidmar,
    firstName: 'Caroline',
    nickName: null,
    lastName: 'Vidmar',
    fromCity: 'Chicago',
    fromState: 'Illinois',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 27,
          description: '',
          job: 'Strategy Consultant',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.GabeOrtis,
    firstName: 'Gabe',
    nickName: null,
    lastName: 'Ortis',
    fromCity: 'Baltimore',
    fromState: 'Maryland',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 26,
          description: '',
          job: 'Radio Host',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.GenevieveMushaluk,
    firstName: 'Genevieve',
    nickName: null,
    lastName: 'Mushaluk',
    fromCity: 'Winnipeg',
    fromState: 'Manitoba',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 33,
          description: '',
          job: 'Corporate Lawyer',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.RomeCooney,
    firstName: 'Rome',
    nickName: null,
    lastName: 'Cooney',
    fromCity: 'Phoenix',
    fromState: 'Arizona',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 30,
          description: '',
          job: 'E-Sports Commentator',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.JonLovett,
    firstName: 'Jon',
    nickName: null,
    lastName: 'Lovett',
    fromCity: 'Los Angeles',
    fromState: 'California',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 42,
          description: '',
          job: 'Podcast Host',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.KishanPatel,
    firstName: 'Kishan',
    nickName: null,
    lastName: 'Patel',
    fromCity: 'San Francisco',
    fromState: 'California',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 31,
          description: '',
          job: 'Emergency Room Doctor',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.KyleOstwald,
    firstName: 'Kyle',
    nickName: null,
    lastName: 'Ostwald',
    fromCity: 'Cheboygan',
    fromState: 'Michigan',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 31,
          description: '',
          job: 'Construction Worker',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.RachelLaMont,
    firstName: 'Rachel',
    nickName: null,
    lastName: 'LaMont',
    fromCity: 'Southfield',
    fromState: 'Michigan',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 34,
          description: '',
          job: 'Graphic Designer',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.SamPhalen,
    firstName: 'Sam',
    nickName: null,
    lastName: 'Phalen',
    fromCity: 'Nashville',
    fromState: 'Tennessee',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 24,
          description: '',
          job: 'Sports Recruiter',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.SierraWright,
    firstName: 'Sierra',
    nickName: null,
    lastName: 'Wright',
    fromCity: 'Pheonixville',
    fromState: 'Pennsylvania',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 27,
          description: '',
          job: 'Nurse',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.SolomonYi,
    firstName: 'Solomon',
    nickName: 'Sol',
    lastName: 'Yi',
    fromCity: 'Norwalk',
    fromState: 'Connecticut',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 43,
          description: '',
          job: 'Medical Drive Sales',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.SueSmey,
    firstName: 'Sue',
    nickName: null,
    lastName: 'Smey',
    fromCity: 'Putnam Valley',
    fromState: 'New York',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 59,
          description: '',
          job: 'Flight School Owner',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.TeenyChirichillo,
    firstName: 'Teeny',
    nickName: null,
    lastName: 'Chirichillo',
    fromCity: 'Manahawkin',
    fromState: 'New Jersey',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 23,
          description: '',
          job: 'Freelance Writer',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.TerranFoster,
    firstName: 'Terran',
    nickName: 'TK',
    lastName: 'Foster',
    fromCity: null,
    fromState: 'Washington D.C.',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 31,
          description: '',
          job: 'Athlete Marketing Manager',
        },
      ],
    ]),
  },
  {
    id: season47SurvivorIds.TiyanaHallums,
    firstName: 'Tiyana',
    nickName: null,
    lastName: 'Hallums',
    fromCity: 'Oahu',
    fromState: 'Hawaii',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        47,
        {
          age: 27,
          description: '',
          job: 'Flight Attendant',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.BiancaRoses,
    firstName: 'Bianca',
    lastName: 'Roses',
    fromCity: 'West Orange',
    fromState: 'N.J.',
    fromCountry: 'US',
    nickName: null,
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 33,
          description: 'Bold, friendly, enthusiastic',
          job: 'PR Consultant',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.CedrekMcFadden,
    firstName: 'Cedrek',
    lastName: 'McFadden',
    fromCity: 'Columbia',
    fromState: 'S.C.',
    fromCountry: 'US',
    nickName: null,
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 45,
          description: 'Dependable, determined, conscientious',
          job: 'Surgeon',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.CharityNeims,
    firstName: 'Charity',
    lastName: 'Neims',
    fromCity: 'Monroe',
    fromState: 'Mich.',
    fromCountry: 'US',
    nickName: null,
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 34,
          description: 'Bold, fun, loyal',
          job: 'Flight Attendant',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.ChrissySarnowsky,
    firstName: 'Chrissy',
    lastName: 'Sarnowsky',
    fromCity: 'South Side of Chicago',
    fromState: 'Ill.',
    fromCountry: 'US',
    nickName: null,
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 55,
          description: 'Badass, lucky, generous',
          job: 'Fire Lieutenant',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.DavidKinne,
    firstName: 'David',
    lastName: 'Kinne',
    fromCity: 'Long Beach',
    fromState: 'Calif.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 39,
          description: 'Passionate, Daring, Curious',
          job: 'Stunt Performer',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.EvaErickson,
    firstName: 'Eva',
    lastName: 'Erickson',
    fromCity: 'Eagan',
    fromState: 'Minn.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 24,
          description: 'Energetic, driven, competitive',
          job: 'PhD Candidate',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.JoeHunter,
    firstName: 'Joe',
    lastName: 'Hunter',
    fromCity: 'Vacaville',
    fromState: 'Calif.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 45,
          description: 'Courageous, compassionate, loving/kick-ass dad!',
          job: 'Fire Captain',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.JustinPioppi,
    firstName: 'Justin',
    lastName: 'Pioppi',
    fromCity: 'Winthrop',
    fromState: 'Mass.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 29,
          description: 'Compassionate, hard-working, resilient',
          job: 'Pizzeria Manager',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.KamillaKarthigesu,
    firstName: 'Kamilla',
    lastName: 'Karthigesu',
    fromState: 'Toronto',
    nickName: null,
    fromCity: null,
    fromCountry: 'Canada',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 31,
          description: 'Silly, expressive, impatient',
          job: 'Software Engineer',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.KevinLeung,
    firstName: 'Kevin',
    lastName: 'Leung',
    fromCity: 'Fremont',
    nickName: null,
    fromState: 'Calif.',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 34,
          description: 'Energetic, social, determined',
          job: 'Finance Manager',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.KyleFraser,
    firstName: 'Kyle',
    lastName: 'Fraser',
    fromCity: 'Roanoke',
    nickName: null,
    fromState: 'Va.',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 31,
          description: 'Fun, crafty, social',
          job: 'Attorney',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.MaryZheng,
    firstName: 'Mary',
    lastName: 'Zheng',
    fromCity: 'Montgomery Village',
    fromState: 'Md.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 31,
          description: 'Substance Abuse Counselor',
          job: 'Chaotic, dynamic, thoughtful',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.MitchGuerra,
    firstName: 'Mitch',
    lastName: 'Guerra',
    fromCity: 'Waco',
    fromState: 'Texas',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 34,
          description: 'Joyful, relational, competitive',
          job: 'P.E. Coach',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.SaiouniaHughley,
    firstName: 'Saiounia',
    lastName: 'Hughley',
    fromCity: 'Philadelphia',
    fromState: 'Pa.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 30,
          description: 'Outgoing, kind, driven',
          job: 'Marketing Professional',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.ShauhinDavari,
    firstName: 'Shauhin',
    lastName: 'Davari',
    fromCity: 'East Bay',
    fromState: 'Calif.',
    fromCountry: 'US',
    nickName: null,
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 38,
          description: 'Charismatic, driven, clever',
          job: 'Debate Professor',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.StarToomey,
    firstName: 'Star',
    lastName: 'Toomey',
    fromState: 'Monrovia',
    fromCity: null,
    nickName: null,
    fromCountry: 'Liberia',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 28,
          description: 'Hilarious, smooth, laugh-out-loud funny.',
          job: 'Sales Expert',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.StephanieBerger,
    firstName: 'Stephanie',
    lastName: 'Berger',
    fromCity: 'New York City',
    fromState: 'N.Y.',
    nickName: null,
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 38,
          description: 'Ambitious, outgoing, resilient',
          job: 'Tech Product Lead',
        },
      ],
    ]),
  },
  {
    id: season48SurvivorIds.ThomasKrottinger,
    firstName: 'Thomas',
    lastName: 'Krottinger',
    fromCity: 'Los Angeles',
    nickName: null,
    fromState: 'Calif.',
    fromCountry: 'US',
    seasonDetails: new Map<number, SurvivorDetailsOnSeason>([
      [
        48,
        {
          age: 34,
          description: 'Outgoing, emotional, loyal',
          job: 'Music Executive',
        },
      ],
    ]),
  },
];

export default survivorsData;

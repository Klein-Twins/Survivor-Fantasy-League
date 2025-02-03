import { UUID } from 'crypto';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/Survivors';

type Season47SurvivorNames =
  | 'AndyRueda'
  | 'AnikaDhar'
  | 'AyshaWelch'
  | 'CarolineVidmar'
  | 'GabeOrtis'
  | 'GenevieveMushaluk'
  | 'RomeCooney'
  | 'JonLovett'
  | 'KishanPatel'
  | 'KyleOstwald'
  | 'RachelLaMont'
  | 'SamPhalen'
  | 'SierraWright'
  | 'SolomonYi'
  | 'SueSmey'
  | 'TeenyChirichillo'
  | 'TerranFoster'
  | 'TiyanaHallums';

export const season47SurvivorIds: Record<Season47SurvivorNames, string> = {
  AndyRueda: 'c76c0a3b-8f2d-4a7e-9483-4b5c0a3e8f2d',
  AnikaDhar: '9d8b7c6a-5f4e-3d2c-1b0a-9f8e7d6c5b4a',
  AyshaWelch: 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
  CarolineVidmar: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  GabeOrtis: 'b2c3d4e5-f6a7-8901-2345-678901abcdef',
  GenevieveMushaluk: 'c3d4e5f6-a7b8-9012-3456-789012abcdef',
  RomeCooney: 'd4e5f6a7-b8c9-0123-4567-890123abcdef',
  JonLovett: 'e5f6a7b8-c9d0-1234-5678-901234abcdef',
  KishanPatel: 'f6a7b8c9-d0e1-2345-6789-012345abcdef',
  KyleOstwald: 'a7b8c9d0-e1f2-3456-7890-123456abcdef',
  RachelLaMont: 'b8c9d0e1-f2a3-4567-8901-234567abcdef',
  SamPhalen: 'c9d0e1f2-a3b4-5678-9012-345678abcdef',
  SierraWright: 'd0e1f2a3-b4c5-6789-0123-456789abcdef',
  SolomonYi: 'e1f2a3b4-c5d6-7890-1234-567890abcdef',
  SueSmey: 'f2a3b4c5-d6e7-8901-2345-678901abcdef',
  TeenyChirichillo: 'a3b4c5d6-e7f8-9012-3456-789012abcdef',
  TerranFoster: 'b4c5d6e7-f8a9-0123-4567-890123abcdef',
  TiyanaHallums: 'c5d6e7f8-a9b0-1234-5678-901234abcdef',
};

const survivors: SurvivorsAttributes[] = [
  {
    survivorId: season47SurvivorIds.AndyRueda,
    firstName: 'Andy',
    nickName: null,
    lastName: 'Rueda',
    fromCity: 'Brooklyn',
    fromState: 'New York',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.AnikaDhar,
    firstName: 'Anika',
    nickName: null,
    lastName: 'Dhar',
    fromCity: 'Los Angeles',
    fromState: 'California',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.AyshaWelch,
    firstName: 'Aysha',
    nickName: null,
    lastName: 'Welch',
    fromCity: 'Houston',
    fromState: 'Texas',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.CarolineVidmar,
    firstName: 'Caroline',
    nickName: null,
    lastName: 'Vidmar',
    fromCity: 'Chicago',
    fromState: 'Illinois',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.GabeOrtis,
    firstName: 'Gabe',
    nickName: null,
    lastName: 'Ortis',
    fromCity: 'Baltimore',
    fromState: 'Maryland',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.GenevieveMushaluk,
    firstName: 'Genevieve',
    nickName: null,
    lastName: 'Mushaluk',
    fromCity: 'Winnipeg',
    fromState: 'Manitoba',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.RomeCooney,
    firstName: 'Rome',
    nickName: null,
    lastName: 'Cooney',
    fromCity: 'Phoenix',
    fromState: 'Arizona',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.JonLovett,
    firstName: 'Jon',
    nickName: null,
    lastName: 'Lovett',
    fromCity: 'Los Angeles',
    fromState: 'California',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.KishanPatel,
    firstName: 'Kishan',
    nickName: null,
    lastName: 'Patel',
    fromCity: 'San Francisco',
    fromState: 'California',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.KyleOstwald,
    firstName: 'Kyle',
    nickName: null,
    lastName: 'Ostwald',
    fromCity: 'Cheboygan',
    fromState: 'Michigan',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.RachelLaMont,
    firstName: 'Rachel',
    nickName: null,
    lastName: 'LaMont',
    fromCity: 'Southfield',
    fromState: 'Michigan',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.SamPhalen,
    firstName: 'Sam',
    nickName: null,
    lastName: 'Phalen',
    fromCity: 'Nashville',
    fromState: 'Tennessee',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.SierraWright,
    firstName: 'Sierra',
    nickName: null,
    lastName: 'Wright',
    fromCity: 'Pheonixville',
    fromState: 'Pennsylvania',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.SolomonYi,
    firstName: 'Solomon',
    nickName: 'Sol',
    lastName: 'Yi',
    fromCity: 'Norwalk',
    fromState: 'Connecticut',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.SueSmey,
    firstName: 'Sue',
    nickName: null,
    lastName: 'Smey',
    fromCity: 'Putnam Valley',
    fromState: 'New York',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.TeenyChirichillo,
    firstName: 'Teeny',
    nickName: null,
    lastName: 'Chirichillo',
    fromCity: 'Manahawkin',
    fromState: 'New Jersey',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.TerranFoster,
    firstName: 'Terran',
    nickName: 'TK',
    lastName: 'Foster',
    fromCity: null,
    fromState: 'Washington D.C.',
    fromCountry: 'US',
  },
  {
    survivorId: season47SurvivorIds.TiyanaHallums,
    firstName: 'Tiyana',
    nickName: null,
    lastName: 'Hallums',
    fromCity: 'Oahu',
    fromState: 'Hawaii',
    fromCountry: 'US',
  },
];
const survivorSeasons: SurvivorDetailsOnSeasonAttributes[] = [
  {
    survivorId: season47SurvivorIds.AndyRueda,
    seasonId: 47,
    originalTribeId: null,
    age: 31,
    description: '',
    job: 'AI Research Assistant',
    imageUrl: 'images/survivors/AndyRueda47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.AnikaDhar,
    seasonId: 47,
    originalTribeId: null,
    age: 26,
    description: '',
    job: 'Marketing Manager',
    imageUrl: 'images/survivors/AnikaDhar47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.AyshaWelch,
    seasonId: 47,
    originalTribeId: null,
    age: 32,
    description: '',
    job: 'Lavo',
    imageUrl: 'images/survivors/AyshaWelch47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.CarolineVidmar,
    seasonId: 47,
    originalTribeId: null,
    age: 27,
    description: '',
    job: 'Strategy Consultant',
    imageUrl: 'images/survivors/CarolineVidmar47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.GabeOrtis,
    seasonId: 47,
    originalTribeId: null,
    age: 26,
    description: '',
    job: 'Radio Host',
    imageUrl: 'images/survivors/GabeOrtis47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.GenevieveMushaluk,
    seasonId: 47,
    originalTribeId: null,
    age: 33,
    description: '',
    job: 'Corporate Lawyer',
    imageUrl: 'images/survivors/GenevieveMushaluk47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.RomeCooney,
    seasonId: 47,
    originalTribeId: null,
    age: 30,
    description: '',
    job: 'E-Sports Commentator',
    imageUrl: 'images/survivors/RomeCooney47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.JonLovett,
    seasonId: 47,
    originalTribeId: null,
    age: 42,
    description: '',
    job: 'Podcast Host',
    imageUrl: 'images/survivors/JonLovett47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.KishanPatel,
    seasonId: 47,
    originalTribeId: null,
    age: 28,
    description: '',
    job: 'Emergency Room Doctor',
    imageUrl: 'images/survivors/KishanPatel47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.KyleOstwald,
    seasonId: 47,
    originalTribeId: null,
    age: 31,
    description: '',
    job: 'Construction Worker',
    imageUrl: 'images/survivors/KyleOstwald47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.RachelLaMont,
    seasonId: 47,
    originalTribeId: null,
    age: 34,
    description: '',
    job: 'Graphic Designer',
    imageUrl: 'images/survivors/RachelLaMont47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.SamPhalen,
    seasonId: 47,
    originalTribeId: null,
    age: 24,
    description: '',
    job: 'Sports Recruiter',
    imageUrl: 'images/survivors/SamPhalen47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.SierraWright,
    seasonId: 47,
    originalTribeId: null,
    age: 27,
    description: '',
    job: 'Nurse',
    imageUrl: 'images/survivors/SierraWright47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.SolomonYi,
    seasonId: 47,
    originalTribeId: null,
    age: 43,
    description: '',
    job: 'Medical Device Sales',
    imageUrl: 'images/survivors/SolomonYi47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.SueSmey,
    seasonId: 47,
    originalTribeId: null,
    age: 59,
    description: '',
    job: 'Flight School Owner',
    imageUrl: 'images/survivors/SueSmey47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.TeenyChirichillo,
    seasonId: 47,
    originalTribeId: null,
    age: 23,
    description: '',
    job: 'Freelance Writer',
    imageUrl: 'images/survivors/TeenyChirichillo47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.TerranFoster,
    seasonId: 47,
    originalTribeId: null,
    age: 31,
    description: '',
    job: 'Athlete Marketing Manager',
    imageUrl: 'images/survivors/TerranFoster47.jpeg',
  },
  {
    survivorId: season47SurvivorIds.TiyanaHallums,
    seasonId: 47,
    originalTribeId: null,
    age: 27,
    description: '',
    job: 'Flight Attendant',
    imageUrl: 'images/survivors/TiyanaHallums47.jpeg',
  },
];

const season47SurvivorData = {
  survivors,
  survivorSeasons,
};

export default season47SurvivorData;

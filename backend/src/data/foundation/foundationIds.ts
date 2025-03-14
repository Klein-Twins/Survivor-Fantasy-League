import { UUID } from 'crypto';
import { SurveyAttributes } from '../../models/surveyAndPick/Survey';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { v4 as uuidv4 } from 'uuid';

type EpisodeKeys = `episode${
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14}`;

export const season47EpisodeIds: Record<
  EpisodeKeys,
  EpisodeAttributes['episodeId']
> = {
  episode1: '7d9c4e1a-8b2f-4c3d-9e5a-6f1b8c7d9e0f',
  episode2: 'a2b3c4d5-e6f7-8901-2345-678901abcdef',
  episode3: 'b3c4d5e6-f7a8-9012-3456-789012abcdef',
  episode4: 'c4d5e6f7-89a0-1234-5678-90123abcdef4',
  episode5: 'd5e6f7a8-90b1-2345-6789-012345abcdef',
  episode6: 'e6f7a8b9-0123-4567-89cd-123456abcdef',
  episode7: 'f7a8b9c0-1234-5678-90ef-234567abcdef',
  episode8: 'a8b9c0d1-2345-6789-01ab-345678abcdef',
  episode9: 'b9c0d1e2-3456-7890-12cd-456789abcdef',
  episode10: 'd6f57df4-4ecf-40bd-a170-ad8766bcdf07',
  episode11: '5a091fbd-53d8-4e03-9b9a-a855afe38105',
  episode12: '64ee948b-0542-4c14-b2b0-66b39de468a9',
  episode13: '66653c70-e999-44d3-970b-1e932b798561',
  episode14: '5b4bbc08-5600-41d8-a1b9-263ffee88b8c',
};

export const season48EpisodeIds: Record<EpisodeKeys, UUID> = {
  episode1: 'b8f0b1b1-9b7d-4e6f-8b1c-2e6f1b8d7c9e',
  episode2: 'b1b2c3d4-e5f6-7890-1234-567890abcdef',
  episode3: 'c2d3e4f5-a6b7-8901-2345-678901abcdef',
  episode4: 'd3e4f5a6-b7c8-9012-3456-789012abcdef',
  episode5: 'e4f5a6b7-c8d9-0123-4567-890123abcdef',
  episode6: 'f5a6b7c8-d9e0-1234-5678-901234abcdef',
  episode7: 'a6b7c8d9-e0f1-2345-6789-012345abcdef',
  episode8: 'b7c8d9e0-f1a2-3456-7890-123456abcdef',
  episode9: 'c8d9e0f1-a2b3-4567-8901-234567abcdef',
  episode10: 'd9e0f1a2-b3c4-5678-9012-345678abcdef',
  episode11: 'e0f1a2b3-c4d5-6789-0123-456789abcdef',
  episode12: 'f1a2b3c4-d5e6-7890-1234-567890abcdef',
  episode13: 'a2b3c4d5-e6f7-8901-2345-678901abcdef',
  episode14: 'b3c4d5e6-f7a8-9012-3456-789012abcdef',
};

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

export const season47SurvivorIds: Record<
  Season47SurvivorNames,
  SurvivorsAttributes['survivorId']
> = {
  AndyRueda: 'c76c0a3b-8f2d-4a7e-9483-4b5c0a3e8f2d',
  AnikaDhar: '9d8b7c6a-5f4e-3d2c-1b0a-9f8e7d6c5b4a',
  AyshaWelch: 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
  CarolineVidmar: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  GabeOrtis: 'b2c3d4e5-f6a7-8901-2345-678901abcdef',
  GenevieveMushaluk: 'c3d4e5f6-a7b8-9012-3456-789012abcdef',
  RomeCooney: '550e8400-e29b-41d4-a716-446655440000',
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

type Season48SurvivorNames =
  | 'StephanieBerger'
  | 'KevinLeung'
  | 'JustinPioppi'
  | 'ShauhinDavari'
  | 'EvaErickson'
  | 'KyleFraser'
  | 'MitchGuerra'
  | 'SaiouniaHughley'
  | 'JoeHunter'
  | 'KamillaKarthigesu'
  | 'DavidKinne'
  | 'ThomasKrottinger'
  | 'CedrekMcFadden'
  | 'CharityNeims'
  | 'BiancaRoses'
  | 'ChrissySarnowsky'
  | 'StarToomey'
  | 'MaryZheng';

export const season48SurvivorIds: Record<Season48SurvivorNames, UUID> = {
  StephanieBerger: 'ac8c39c3-d086-4ef2-aa81-17843d245260',
  KevinLeung: '35a9facf-b0e3-408f-aa47-8101f2408421',
  JustinPioppi: '99e3659f-f847-447d-add7-e87d074e8c27',
  ShauhinDavari: '514ead81-9cdc-41c8-a113-8d84e3132485',
  EvaErickson: '49156c54-b901-4582-9167-2d6271b07e9f',
  KyleFraser: 'cf464b55-5bea-4b6b-8a81-f74686669e43',
  MitchGuerra: '1605cf4e-1156-4ddf-8ec8-375d2f10160f',
  SaiouniaHughley: 'c4a2c9cf-5262-4e0a-8290-7481bad624a6',
  JoeHunter: '1d9f759e-1bfb-47e2-97c3-15ae79b85636',
  KamillaKarthigesu: '46a4dc9f-b63d-4d9e-8360-36d36d46f71e',
  DavidKinne: '7ac01e6e-137a-4b3b-aead-fefc9786dd7f',
  ThomasKrottinger: 'cda3198e-0875-4096-81e6-8a4afb63ebc4',
  CedrekMcFadden: '95643a5d-4e82-4819-aa3a-15a206420645',
  CharityNeims: 'a7e401b1-82e4-4367-a228-c802196fc74c',
  BiancaRoses: 'c5b905b9-4fb2-448b-91f4-845684f6ef29',
  ChrissySarnowsky: 'cae5c79b-225d-4e11-95ea-c3dd748c298d',
  StarToomey: 'cba37a9b-ea47-42b4-bbc5-366ebce84146',
  MaryZheng: '76b6811f-df81-4e8c-bcae-10056bff43fa',
};

type TribeName = 'Gata' | 'Tuku' | 'Lavo' | 'Beka';
type season48TribeName = 'Vula' | 'Lagi' | 'Civa';

export const season47TribeIds: Record<TribeName, UUID> = {
  Gata: '7f833e71-de61-4588-8085-ee75f4542317',
  Tuku: '0a4c2896-3013-4639-a54e-1a26f90dae25',
  Lavo: '050bbc42-e239-405d-997e-96c2dd0c308d',
  Beka: 'e82fd9fc-3bef-4f0d-b1cf-131ea8397662',
};

export const season48TribeIds: Record<season48TribeName, UUID> = {
  Vula: 'cac70173-4546-49f6-88db-513bd3baad99',
  Lagi: 'c1ae46fa-7ed0-489c-968c-b228a7870585',
  Civa: '56107769-c43c-4121-b553-164efc833fba',
};

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

interface Season48EpisodeChallengeMap {
  episode1: { reward1: UUID; reward2: UUID; rewardAndImmunity1: UUID };
  episode2: { rewardAndImmunity1: UUID };
  episode3: { rewardAndImmunity1: UUID };
}

export const season48ChallengeIds: Season48EpisodeChallengeMap = {
  episode1: {
    reward1: 'b566364c-564c-4a99-a38e-c74b50f051b5',
    reward2: 'dec2ef27-678e-4115-aa2b-6615480aa6fe',
    rewardAndImmunity1: 'eacaaee2-96ac-4b76-bfb7-89fb31ae8260',
  },
  episode2: {
    rewardAndImmunity1: '93744872-4247-4013-a5fc-62719833a5c3',
  },
  episode3: {
    rewardAndImmunity1: '5a137930-3064-435d-be79-21e43d450b91',
  },
};

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

export const defaultSurveyIds: Record<
  'DefaultWeeklySurvey' | 'DefaultPremierSurvey',
  SurveyAttributes['surveyId']
> = {
  DefaultWeeklySurvey: '550e8400-e29b-41d4-a716-446655440000',
  DefaultPremierSurvey: '67e55044-10b1-426f-9247-bb680e5fe0c8',
};

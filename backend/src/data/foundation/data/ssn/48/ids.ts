import { UUID } from 'crypto';
import { Season48Tribes } from './season48';

export type EpisodeKeys = `episode${
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

export const season48TribeIds: Record<Season48Tribes, UUID> = {
  Vula: 'cac70173-4546-49f6-88db-513bd3baad99',
  Lagi: 'c1ae46fa-7ed0-489c-968c-b228a7870585',
  Civa: '56107769-c43c-4121-b553-164efc833fba',
  Merge: 'd0f3b1a2-4c5e-4f8b-9c7d-6a2e5f3b1a2c',
};

interface Season48EpisodeChallengeMap {
  episode1: { reward1: UUID; reward2: UUID; rewardAndImmunity1: UUID };
  episode2: { rewardAndImmunity1: UUID };
  episode3: { rewardAndImmunity1: UUID };
  episode4: { rewardAndImmunity1: UUID };
  episode5: { reward1: UUID; immunity1: UUID };
  episode6: { reward1: UUID; immunity1: UUID };
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
  episode4: {
    rewardAndImmunity1: 'f2a0b3d4-5e6f-4c7b-8a9b-0c1d2e3f4a5b',
  },
  episode5: {
    reward1: '72632953-dd6b-4fe1-9845-bee61560af2c',
    immunity1: '2a25a649-c134-4e8f-95a9-4389844fe217',
  },
  episode6: {
    reward1: 'eaeeef0d-2f22-45b2-84b7-bac103c1514b',
    immunity1: 'ac7e2a0d-1ac0-46a6-a8ca-d6b77c594b0c',
  },
};

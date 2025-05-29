import { season48 } from '../../../foundation/data/ssn/48/season48Backup';
import season48TestLeagues, {
  League,
  season48TestLeague1,
  season48TestLeague1Id,
} from '../leagues48';
import { survivorEliminationPickId } from '../../../foundation/data/surveysAndPicks/pickData/picksData';
import { season48SurvivorIds } from '../../../foundation/data/ssn/48/ids';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { PickIdAndPlayerChoice } from '../../../../generated-api';
import { LeagueAttributes } from '../../../../models/league/League';
import { ProfileAttributes } from '../../../../models/account/Profile';
import testLeagueData from '../testLeagueData';
import { LeagueProfileAttributes } from '../../../../models/league/LeagueProfile';
import { testProfileIds } from '../../data/account/testAccountData';

export type EpisodeToLeagueMemberSurveysMap = Map<
  EpisodeAttributes['id'],
  LeagueMemberSurveys
>;

export type LeagueMemberSurveys = Map<
  ProfileAttributes['profileId'],
  LeagueMemberSurvey
>;

export type LeagueMemberSurvey = PickIdAndPlayerChoice[];

const testLeague1EpisodeSurveySubmissionMap = new Map<
  EpisodeAttributes['id'],
  LeagueMemberSurveys
>([
  [
    season48.episodes.get(1)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.StephanieBerger],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(2)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.KamillaKarthigesu],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(3)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.KamillaKarthigesu],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(4)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.SaiouniaHughley],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(5)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.CharityNeims],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(6)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.CharityNeims],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(7)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.SaiouniaHughley],
          },
        ],
      ],
    ]),
  ],
  [
    season48.episodes.get(8)!.episodeInfo.id,
    new Map<ProfileAttributes['profileId'], LeagueMemberSurvey>([
      [
        testProfileIds.TonyStark,
        [
          {
            pickId: survivorEliminationPickId,
            choice: [season48SurvivorIds.SaiouniaHughley],
          },
        ],
      ],
    ]),
  ],
]);

const testLeagueSurveyData = new Map<
  LeagueAttributes['leagueId'],
  EpisodeToLeagueMemberSurveysMap
>();

testLeagueSurveyData.set(
  '9dd3c2a0-da9c-4330-8a77-ad57d91015db',
  testLeague1EpisodeSurveySubmissionMap
);

export default testLeagueSurveyData;

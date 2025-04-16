import { season48 } from '../../../foundation/data/ssn/48/season48';
import season48TestLeagues, { season48TestLeague1 } from '../leagues48';
import { survivorEliminationPickId } from '../../../foundation/data/surveysAndPicks/pickData/picksData';
import { season48SurvivorIds } from '../../../foundation/data/ssn/48/ids';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { PickIdAndPlayerChoice } from '../../../../generated-api';
import { LeagueAttributes } from '../../../../models/league/League';
import { ProfileAttributes } from '../../../../models/account/Profile';
import { testProfileIds } from '../../devIds';
import testLeagueData from '../testLeagueData';

type EpisodeId = EpisodeAttributes['id'];

type EpisodeSurveyMapping = Map<EpisodeId, PickIdAndPlayerChoice[]>;

type SurveyProfileData = {
  leagueId: LeagueAttributes['leagueId'];
  profileId: ProfileAttributes['profileId'];
};

export type SurveyData = SurveyProfileData & {
  surveys: EpisodeSurveyMapping;
};

type SurveyAnswers = {
  episodeId: EpisodeId;
  playerChoices: PickIdAndPlayerChoice[] | PickIdAndPlayerChoice;
};
const tonyStarkLeague1Surveys: SurveyData = {
  leagueId: season48TestLeagues[0].leagueId,
  profileId: testProfileIds.TonyStark, // Replace with the actual profile ID
  surveys: new Map<EpisodeId, PickIdAndPlayerChoice[]>([
    [
      season48.episodes.get(1)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.BiancaRoses],
        },
      ],
    ],
    [
      season48.episodes.get(2)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.KamillaKarthigesu],
        },
      ],
    ],
    [
      season48.episodes.get(3)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.KamillaKarthigesu],
        },
      ],
    ],
    [
      season48.episodes.get(4)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.SaiouniaHughley],
        },
      ],
    ],
    [
      season48.episodes.get(5)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.CharityNeims],
        },
      ],
    ],
    [
      season48.episodes.get(6)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.CharityNeims],
        },
      ],
    ],
    [
      season48.episodes.get(7)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.SaiouniaHughley],
        },
      ],
    ],
    [
      season48.episodes.get(8)!.episodeInfo.id,
      [
        {
          pickId: survivorEliminationPickId,
          choice: [season48SurvivorIds.SaiouniaHughley],
        },
      ],
    ],
  ]),
};

const testLeagueSurveyData = {
  tonyStarkLeague1Surveys,
};

export default testLeagueSurveyData;

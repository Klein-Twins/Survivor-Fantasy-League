import { Sequelize } from 'sequelize';
import UserModel from './account/User';
import PasswordModel from './account/Password';
import SurvivorsModel from './survivors/Survivors';
import SeasonsModel from './season/Seasons';
import LeagueModel from './league/League';
import SurvivorDetailsOnSeasonModel from './survivors/SurvivorDetailsOnSeason';
import ProfileModel from './account/Profile';
import TokensModel from './account/Tokens';
import LeagueProfileModel from './league/LeagueProfile';
import TribeModel from './season/Tribes';
import EpisodeModel from './season/Episodes';
import SurveyModel from './surveyAndPick/Survey';
import SurveyPicksModel from './surveyAndPick/SurveyPicks';
import LeagueSurveyForEpisodeModel from './league/LeagueSurveysForEpisode';
import ChallengeModel from './season/challenges/Challenges';
import SeasonEliminationsModel from './season/SeasonEliminations';
import ChallengeWinnersModel from './season/challenges/ChallengeWinners';
import PicksModel from './surveyAndPick/picks/Picks';
import PickOptionsModel from './surveyAndPick/picks/PickOptions';
import PickPointsModel from './surveyAndPick/picks/PickPoints';
import PickSolutionModel from './surveyAndPick/picks/PickCorrectAnswers';
import ProfilePickModel from './league/LeagueProfilePicks';
import PickTypeModel from './surveyAndPick/picks/PickType';
import logger from '../config/logger';
import SurveySubmissionModel from './league/SurveySubmissions';
import PickSubmissionModel from './league/PickSubmission';
import EpisodeSurveyModel from './surveyAndPick/EpisodeSurvey';
import TribeMembersModel from './season/TribeMembers';

const initModels = (sequelize: Sequelize) => {
  logger.debug('Initializing models');

  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const League = LeagueModel(sequelize);
  const SurvivorDetailsOnSeason = SurvivorDetailsOnSeasonModel(sequelize);
  const Profile = ProfileModel(sequelize);
  const Tokens = TokensModel(sequelize);
  const LeagueProfile = LeagueProfileModel(sequelize);
  const Picks = PicksModel(sequelize);
  //const PickOptions = PickOptionsModel(sequelize);
  const PickPoints = PickPointsModel(sequelize);
  //const PickType = PickTypeModel(sequelize);
  //const ProfilePick = ProfilePickModel(sequelize);
  //const PickSolution = PickSolutionModel(sequelize);
  const Episode = EpisodeModel(sequelize);
  const Tribe = TribeModel(sequelize);
  const Survey = SurveyModel(sequelize);
  const EpisodeSurvey = EpisodeSurveyModel(sequelize);
  const SurveyPicks = SurveyPicksModel(sequelize);
  const LeagueSurveyForEpisode = LeagueSurveyForEpisodeModel(sequelize);
  const Challenges = ChallengeModel(sequelize);
  const ChallengeWinners = ChallengeWinnersModel(sequelize);
  const SeasonEliminations = SeasonEliminationsModel(sequelize);
  const SurveySubmissions = SurveySubmissionModel(sequelize);
  const PickSubmissions = PickSubmissionModel(sequelize);
  const TribeMembers = TribeMembersModel(sequelize);

  logger.debug('Models initialized');

  User.associate({ Password, Profile });
  Profile.associate({ User, LeagueProfile });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile, LeagueSurveyForEpisode });
  Survivors.associate({
    SurvivorDetailsOnSeason,
  });
  Seasons.associate({
    SurvivorDetailsOnSeason,
    League,
    Episode,
    SeasonEliminations,
    Tribe,
  });
  SurvivorDetailsOnSeason.associate({
    Survivors,
    Seasons,
    SeasonEliminations,
    ChallengeWinners,
    TribeMembers,
  });

  LeagueProfile.associate({ League, Profile, SurveySubmissions });
  Tribe.associate({ ChallengeWinners, Seasons, Episode, TribeMembers });
  Episode.associate({
    Seasons,
    SeasonEliminations,
    Challenges,
    Tribe,
    TribeMembers,
    EpisodeSurvey,
  });
  SeasonEliminations.associate({ Seasons, Episode, SurvivorDetailsOnSeason });
  ChallengeWinners.associate({
    Tribe,
    Challenges,
    SurvivorDetailsOnSeason,
  });
  TribeMembers.associate({ Tribe, Episode, SurvivorDetailsOnSeason });
  EpisodeSurvey.associate({ Survey, Episode, LeagueSurveyForEpisode });
  Survey.associate({ EpisodeSurvey, SurveyPicks });
  SurveyPicks.associate({ Survey, Picks });
  LeagueSurveyForEpisode.associate({
    EpisodeSurvey,
    League,
    SurveySubmissions,
  });
  Picks.associate({ SurveyPicks, PickSubmissions, PickPoints });
  //Todo add associations with tokens
  Tokens.associate({});
  PickPoints.associate({ Picks });
  SurveySubmissions.associate({
    PickSubmissions,
    LeagueProfile,
    LeagueSurveyForEpisode,
  });
  PickSubmissions.associate({ SurveySubmissions, Picks });
  Challenges.associate({ Episode, ChallengeWinners });

  logger.debug('Models associated');

  return {
    sequelize,
    User,
    Password,
    Survivors,
    Seasons,
    League,
    SurvivorDetailsOnSeason,
    Profile,
    Tokens,
    LeagueProfile,
    Picks,
    //PickOptions,
    PickPoints,
    //PickType,
    //ProfilePick,
    //PickSolution,
    Tribe,
    Episode,
    Survey,
    LeagueSurveyForEpisode,
    SurveyPicks,
    Challenges,
    ChallengeWinners,
    SeasonEliminations,
    SurveySubmissions,
    PickSubmissions,
    EpisodeSurvey,
    TribeMembers,
  };
};

export default initModels;

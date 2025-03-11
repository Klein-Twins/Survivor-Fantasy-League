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
import SurveyModel from './surveysAndPicks/Survey';
import SurveyPicksModel from './surveysAndPicks/SurveyPicks';
import LeagueSurveyModel from './league/LeagueSurveys';
import ChallengeModel from './season/challenges/Challenges';
import SeasonEliminationsModel from './season/SeasonEliminations';
import ChallengeWinnersModel from './season/challenges/ChallengeWinners';
import NotificationModel from './account/Notification';
import PicksModel from './surveysAndPicks/picks/Picks';
import PickOptionsModel from './surveysAndPicks/picks/PickOptions';
import PickPointsModel from './surveysAndPicks/picks/PickPoints';
import PickSolutionModel from './surveysAndPicks/picks/PickCorrectAnswers';
import ProfilePickModel from './league/LeagueProfilePicks';
import PickTypeModel from './surveysAndPicks/picks/PickType';
import logger from '../config/logger';
import SurveySubmissionModel from './league/SurveySubmissions';

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
  const Notification = NotificationModel(sequelize);
  const Picks = PicksModel(sequelize);
  const PickOptions = PickOptionsModel(sequelize);
  const PickPoints = PickPointsModel(sequelize);
  const PickType = PickTypeModel(sequelize);
  const ProfilePick = ProfilePickModel(sequelize);
  const PickSolution = PickSolutionModel(sequelize);
  const Episode = EpisodeModel(sequelize);
  const Tribe = TribeModel(sequelize);
  const Survey = SurveyModel(sequelize);
  const SurveyPicks = SurveyPicksModel(sequelize);
  const LeagueSurveys = LeagueSurveyModel(sequelize);
  const Challenges = ChallengeModel(sequelize);
  const ChallengeWinners = ChallengeWinnersModel(sequelize);
  const SeasonEliminations = SeasonEliminationsModel(sequelize);
  const SurveySubmissions = SurveySubmissionModel(sequelize);

  logger.debug('Models initialized');

  User.associate({ Password, Profile, Tokens });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile });
  Survivors.associate({ SurvivorDetailsOnSeason, ChallengeWinners });
  Seasons.associate({
    SurvivorDetailsOnSeason,
    League,
    Episode,
    SeasonEliminations,
    Tribe,
  });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons, SeasonEliminations });
  Profile.associate({ User, LeagueProfile, Notification });
  Tokens.associate({ User });
  LeagueProfile.associate({ League, Profile });
  Notification.associate({ Profile });
  Tribe.associate({ ChallengeWinners, Seasons, Episode });
  Episode.associate({ Seasons, SeasonEliminations, Challenges, Tribe });
  SeasonEliminations.associate({ Seasons, Episode, Survivors });
  ChallengeWinners.associate({ Survivors, Tribe, Episode });

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
    Notification,
    Picks,
    PickOptions,
    PickPoints,
    PickType,
    ProfilePick,
    PickSolution,
    Tribe,
    Episode,
    Survey,
    LeagueSurveys,
    SurveyPicks,
    Challenges,
    ChallengeWinners,
    SeasonEliminations,
    SurveySubmissions,
  };
};

export default initModels;

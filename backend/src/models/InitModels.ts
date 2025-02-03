import { Sequelize } from 'sequelize';
import UserModel from './User';
import PasswordModel from './Password';
import SurvivorsModel from './Survivors';
import SeasonsModel from './Seasons';
import LeagueModel from './League';
import SurvivorDetailsOnSeasonModel from './SurvivorDetailsOnSeason';
import ProfileModel from './Profile';
import TokensModel from './Tokens';
import LeagueProfileModel from './LeagueProfile';
import NotificationModel from './Notification';
import PickSolutionModel from './picks/PCK_CORRECT_ANSWERS';
import PicksModel from './picks/PCK_PICKS';
import PickOptionsModel from './picks/PCK_PICK_OPTIONS';
import PickPointsModel from './picks/PCK_PICK_POINTS';
import PickTypeModel from './picks/PCK_PICK_TYPE';
import ProfilePickModel from './picks/PCK_PROFILE_PICKS';
import TribeModel from './season/SSN_TRIBES';
import EpisodeModel from './season/SSN_EPISODES';
import SurveyModel from './SurveysAndPicks/Survey';
import SurveyPicksModel from './SurveysAndPicks/SurveyPicks';
import LeagueSurveyModel from './League/LeagueSurvey';
import ChallengeModel from './season/SSN_CHALLENGES';
import ChallengeWinnersModel from './season/SSN_CHALLENGE_WINNERS';
import SeasonEliminationsModel from './season/SSN_ELIMINATIONS';

const initModels = (sequelize: Sequelize) => {
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

  User.associate({ Password, Profile, Tokens });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile });
  Survivors.associate({ SurvivorDetailsOnSeason });
  Seasons.associate({ SurvivorDetailsOnSeason, League, Episode, SeasonEliminations });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons, SeasonEliminations });
  Profile.associate({ User, LeagueProfile, Notification });
  Tokens.associate({ User });
  LeagueProfile.associate({ League, Profile });
  Notification.associate({ Profile });

  // Tribe.associate({ });
  Episode.associate({ Seasons, SeasonEliminations });

  // Picks.associate({ PickOptions, ProfilePick });
  // PickOptions.associate({ Picks });
  // ProfilePick.associate({ Picks, LeagueProfile, League, Episode, Tribe, Survivors });

  //Asscocite SeasonEliminations
  SeasonEliminations.associate({ Seasons, Episode, Survivors });

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
  };
};

export default initModels;

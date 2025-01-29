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

  User.associate({ Password, Profile, Tokens });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile });
  Survivors.associate({ SurvivorDetailsOnSeason, ProfilePick });
  Seasons.associate({ SurvivorDetailsOnSeason, League, Episode });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons });
  Profile.associate({ User, LeagueProfile, Notification });
  Tokens.associate({ User });
  LeagueProfile.associate({ League, Profile, ProfilePick });
  Notification.associate({ Profile });

  Tribe.associate({ ProfilePick });
  Episode.associate({ Seasons, ProfilePick });

  Picks.associate({ PickOptions, ProfilePick });
  PickOptions.associate({ Picks });
  ProfilePick.associate({ Picks, LeagueProfile, League, Episode, Tribe, Survivors });

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
  };
};

export default initModels;

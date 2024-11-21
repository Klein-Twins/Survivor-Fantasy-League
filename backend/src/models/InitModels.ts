import { Sequelize } from "sequelize";
import UserModel from "./User";
import PasswordModel from "./Password";
import SurvivorsModel from "./Survivors";
import SeasonsModel from "./Seasons";
import LeagueModel from "./League";
import SurvivorDetailsOnSeasonModel from "./SurvivorDetailsOnSeason";
import ProfileModel from "./Profile";
import TokensModel from "./Tokens";
import LeagueProfileModel from "./LeagueProfile";
import NotificationModel from "./Notification";

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

  User.associate({ Password, Profile, Tokens });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile });
  Survivors.associate({ SurvivorDetailsOnSeason });
  Seasons.associate({ SurvivorDetailsOnSeason, League });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons });
  Profile.associate({ User, LeagueProfile, Notification });
  Tokens.associate({ User });
  LeagueProfile.associate({ League, Profile });
  Notification.associate({ Profile });

  return {
    User,
    Password,
    Survivors,
    Seasons,
    League,
    SurvivorDetailsOnSeason,
    Profile,
    Tokens,
    LeagueProfile,
    Notification
  };
};

export default initModels;

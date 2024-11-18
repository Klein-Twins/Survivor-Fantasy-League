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
import { sequelize } from '../config/db';

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

  User.associate({ Password, Profile, Tokens });
  Password.associate({ User });
  League.associate({ Seasons, LeagueProfile })
  Survivors.associate({ SurvivorDetailsOnSeason });
  Seasons.associate({ SurvivorDetailsOnSeason, League });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons });
  Profile.associate({ User, LeagueProfile });
  Tokens.associate({ User });
  LeagueProfile.associate({ League, Profile });

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
  };
};

export default initModels;

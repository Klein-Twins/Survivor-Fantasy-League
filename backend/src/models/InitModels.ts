import { Sequelize } from 'sequelize';
import UserModel from './User';
import PasswordModel from './Password';
import SurvivorsModel from './Survivors';
import SeasonsModel from './Seasons';
import LeaguesModel from './Leagues';
import SurvivorDetailsOnSeasonModel from './SurvivorDetailsOnSeason';
import ProfileModel from './Profile';
import TokensModel from './Tokens';

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const Leagues = LeaguesModel(sequelize);
  const SurvivorDetailsOnSeason = SurvivorDetailsOnSeasonModel(sequelize);
  const Profile = ProfileModel(sequelize);
  const Tokens = TokensModel(sequelize);

  User.associate({ Password, Profile, Tokens });
  Password.associate({ User });
  Leagues.associate({Seasons})
  Survivors.associate({ SurvivorDetailsOnSeason });
  Seasons.associate({ SurvivorDetailsOnSeason, Leagues });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons });
  Profile.associate({ User });
  Tokens.associate({ User });

  return {
    User,
    Password,
    Survivors,
    Seasons,
    Leagues,
    SurvivorDetailsOnSeason,
    Profile,
    Tokens
  };
};

export default initModels;
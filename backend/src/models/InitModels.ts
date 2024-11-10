import { Sequelize } from 'sequelize';
import UserModel from './User';
import PasswordModel from './Password';
import SurvivorsModel from './Survivors';
import SeasonsModel from './Seasons';
import SurvivorDetailsOnSeasonModel from './SurvivorDetailsOnSeason';
import ProfileModel from './Profile';

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const SurvivorDetailsOnSeason = SurvivorDetailsOnSeasonModel(sequelize);
  const Profile = ProfileModel(sequelize);

  User.associate({ Password, Profile });
  Password.associate({ User });
  Survivors.associate({ SurvivorDetailsOnSeason });
  Seasons.associate({ SurvivorDetailsOnSeason });
  SurvivorDetailsOnSeason.associate({ Survivors, Seasons });
  Profile.associate({ User });

  return {
    User,
    Password,
    Survivors,
    Seasons,
    SurvivorDetailsOnSeason,
    Profile
  };
};

export default initModels;
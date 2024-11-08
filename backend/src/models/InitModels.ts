import { Sequelize } from 'sequelize';
import UserModel from './User';
import PasswordModel from './Password';
import SurvivorsModel from './Survivors';
import SeasonsModel from './Seasons';
import SeasonSurvivorCastMembersModel from './SeasonSurvivorCastMembers';
import ProfileModel from './Profile';

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const SeasonSurvivorCastMembers = SeasonSurvivorCastMembersModel(sequelize);
  const Profile = ProfileModel(sequelize);

  // Set up associations
  User.associate({ Password, Profile });
  Password.associate({ User });
  Seasons.associate({ SeasonSurvivorCastMembers });
  Survivors.associate({ SeasonSurvivorCastMembers });
  SeasonSurvivorCastMembers.associate({ Survivors, Seasons });
  Profile.associate({ User });

  return {
    User,
    Password,
    Survivors,
    Seasons,
    SeasonSurvivorCastMembers,
    Profile
  };
};

export default initModels;
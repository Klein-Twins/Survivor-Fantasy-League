import { Sequelize } from 'sequelize';
import UserModel from './User';
import PasswordModel from './Password';
import SurvivorsModel from './Survivors';
import SeasonsModel from './Seasons';
import SeasonSurvivorCastMembersModel from './SeasonSurvivorCastMembers';

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const SeasonSurvivorCastMembers = SeasonSurvivorCastMembersModel(sequelize);

  // Set up associations
  User.associate({ Password });
  Password.associate({ User });
  Seasons.associate({ SeasonSurvivorCastMembers });
  Survivors.associate({ SeasonSurvivorCastMembers });
  SeasonSurvivorCastMembers.associate({ Survivors, Seasons });

  return {
    User,
    Password,
    Survivors,
    Seasons,
    SeasonSurvivorCastMembers,
  };
};

export default initModels;
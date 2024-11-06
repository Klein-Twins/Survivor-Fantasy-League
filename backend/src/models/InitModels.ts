import { Sequelize } from 'sequelize';
import UserModel from './User';
import PasswordModel from './Password';
import SurvivorsModel from './Survivors';
import SeasonsModel from './Seasons';
import SeasonSurvivorCastMembersModel from './SeasonSurvivorCastMembers';
import LeagueModel from './Leagues';

const initModels = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Password = PasswordModel(sequelize);
  const Survivors = SurvivorsModel(sequelize);
  const Seasons = SeasonsModel(sequelize);
  const SeasonSurvivorCastMembers = SeasonSurvivorCastMembersModel(sequelize);
  const League = LeagueModel(sequelize);

  // Set up associations
  User.associate({ Password });
  Password.associate({ User });
  Seasons.associate({ SeasonSurvivorCastMembers, League });
  Survivors.associate({ SeasonSurvivorCastMembers });
  SeasonSurvivorCastMembers.associate({ Survivors, Seasons });
  League.associate({Survivors, Seasons})

  return {
    User,
    Password,
    Survivors,
    Seasons,
    SeasonSurvivorCastMembers,
    League
  };
};

export default initModels;
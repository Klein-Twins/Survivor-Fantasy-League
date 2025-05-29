import { UUID } from 'crypto';
import { UserAttributes } from '../account/User';
import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../config/logger';

export interface UserSessionAttributes {
  id: UUID;
  startTime: Date;
  endTime: Date | null;
  accountId: UserAttributes['userId'];
  expectedEndTime: Date;
}

export const USERSESSION_TO_USER = 'user';
export const USERSESSION_TO_TOKENS = 'tokens';

const UserSessionModel = (sequelize: Sequelize) => {
  class UserSession
    extends Model<UserSessionAttributes>
    implements UserSessionAttributes
  {
    public id!: UserSessionAttributes['id'];
    public startTime!: UserSessionAttributes['startTime'];
    public endTime!: UserSessionAttributes['endTime'];
    public accountId!: UserSessionAttributes['accountId'];
    public expectedEndTime!: Date;

    static associate(models: any) {
      if (models.User) {
        this.belongsTo(models.User, {
          foreignKey: 'accountId',
          targetKey: 'userId',
          as: USERSESSION_TO_USER,
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating UserSession with Account');
      }
      if (models.Tokens) {
        this.hasMany(models.Tokens, {
          foreignKey: 'userSessionId',
          sourceKey: 'id',
          as: USERSESSION_TO_TOKENS,
          onDelete: 'CASCADE',
        });
      }
    }
  }

  UserSession.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'SESSION_ID',
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'START_TIME',
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'END_TIME',
      },
      expectedEndTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'EXPECTED_END_TIME',
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'ACCOUNT_ID',
      },
    },
    {
      sequelize,
      tableName: 'USER_SESSION',
    }
  );
  return UserSession;
};

export default UserSessionModel;

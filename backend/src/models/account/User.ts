import { DataTypes, Model, Sequelize } from 'sequelize';
import { AccountRole } from '../../generated-api';
import { ProfileAttributes } from './Profile';
import { UUID } from 'crypto';
import logger from '../../config/logger';

export interface UserAttributes {
  userId: UUID;
  userName: string;
  profileId: ProfileAttributes['profileId'];
  email: string;
  userRole: AccountRole;
}

export const USER_TO_PASSWORDS = 'passwords';
export const USER_TO_PROFILE = 'profile';
export const USER_TO_USERSESSIONS = 'userSessions';

const UserModel = (sequelize: Sequelize) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public userId!: UserAttributes['userId'];
    public userName!: UserAttributes['userName'];
    public profileId!: UserAttributes['profileId'];
    public email!: UserAttributes['email'];
    public userRole!: UserAttributes['userRole'];

    static associate(models: any) {
      if (models.Password) {
        this.hasMany(models.Password, {
          foreignKey: 'userId',
          sourceKey: 'userId',
          as: USER_TO_PASSWORDS,
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating User with Password');
      }
      if (models.Profile) {
        this.belongsTo(models.Profile, {
          foreignKey: 'profileId',
          targetKey: 'profileId',
          as: USER_TO_PROFILE,
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating User with Profile');
      }
      if (models.UserSessions) {
        this.hasMany(models.UserSessions, {
          foreignKey: 'accountId',
          sourceKey: 'userId',
          as: USER_TO_USERSESSIONS,
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating User with UserSessions');
      }
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'USER_ID',
      },
      userName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'USER_NAME',
      },
      profileId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        field: 'USER_PROFILE_ID',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'USER_EMAIL',
      },
      userRole: {
        type: DataTypes.ENUM(...Object.values(AccountRole)),
        allowNull: false,
        field: 'USER_ROLE',
      },
    },
    {
      sequelize,
      tableName: 'USR_USERS',
      timestamps: true,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      indexes: [
        {
          unique: true,
          fields: ['USER_NAME'],
        },
        {
          unique: true,
          fields: ['USER_EMAIL'],
        },
      ],
    }
  );

  return User;
};

export default UserModel;

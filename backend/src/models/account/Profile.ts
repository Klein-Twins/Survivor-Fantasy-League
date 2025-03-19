import { DataTypes, Model, Sequelize } from 'sequelize';
import { UUID } from 'crypto';
import logger from '../../config/logger';

export interface ProfileAttributes {
  profileId: UUID;
  firstName?: string | null;
  lastName?: string | null;
}

const ProfileModel = (sequelize: Sequelize) => {
  class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public profileId!: ProfileAttributes['profileId'];
    public firstName?: ProfileAttributes['firstName'];
    public lastName?: ProfileAttributes['lastName'];

    static associate(models: any) {
      if (models.User) {
        this.hasOne(models.User, {
          foreignKey: 'profileId',
          sourceKey: 'profileId',
          as: 'User',
        });
      } else {
        logger.error('Error associating Profile with User');
      }
      if (models.LeagueProfile) {
        this.hasMany(models.LeagueProfile, {
          foreignKey: 'profileId',
          sourceKey: 'profileId',
          as: 'leagueProfiles',
        });
        this.hasMany(models.LeagueProfile, {
          foreignKey: 'inviterProfileId',
          sourceKey: 'profileId',
          as: 'inviterProfile',
        });
      } else {
        logger.error('Error associating Profile with LeagueProfile');
      }
    }
  }

  Profile.init(
    {
      profileId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'PROFILE_ID',
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'FIRST_NAME',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'LAST_NAME',
      },
    },
    {
      sequelize,
      tableName: 'PRF_PROFILE',
      timestamps: true,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
    }
  );

  return Profile;
};

export default ProfileModel;

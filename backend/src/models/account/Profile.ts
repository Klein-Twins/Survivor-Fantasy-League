import { DataTypes, Model, Sequelize } from 'sequelize';
import { defaultProfileImagePath } from '../../constants/defaultImagePaths';

export interface ProfileAttributes {
  profileId: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl: string;
}

const ProfileModel = (sequelize: Sequelize) => {
  class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public profileId!: ProfileAttributes['profileId'];
    public firstName?: ProfileAttributes['firstName'];
    public lastName?: ProfileAttributes['lastName'];
    public imageUrl!: ProfileAttributes['imageUrl'];

    static associate(models: any) {
      this.hasOne(models.User, {
        foreignKey: 'profileId',
        sourceKey: 'profileId',
        as: 'User',
      });
      this.hasMany(models.LeagueProfile, {
        foreignKey: 'profileId',
        sourceKey: 'profileId',
        as: 'leagueProfiles',
      });
      this.hasMany(models.Notification, {
        foreignKey: 'profileId',
        sourceKey: 'profileId',
        as: 'profile',
      });
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
      imageUrl: {
        type: DataTypes.STRING(200),
        defaultValue: defaultProfileImagePath,
        field: 'IMAGE_URL',
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

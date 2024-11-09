import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ProfileAttributes {
  PROFILE_ID: string;
  FIRST_NAME?: string | null;
  LAST_NAME?: string | null;
  IMAGE_URL?: string | null;
}

const ProfileModel = (sequelize: Sequelize) => {
  class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public PROFILE_ID!: string;
    public FIRST_NAME?: string | null;
    public LAST_NAME?: string | null;
    public IMAGE_URL?: string | null;

    static associate(models: any) {
      this.hasOne(models.User, { foreignKey: 'USER_PROFILE_ID', as: 'User' });
    }
  }

  Profile.init(
    {
      PROFILE_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'PROFILE_ID',
      },
      FIRST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'FIRST_NAME',
      },
      LAST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'LAST_NAME',
      },
      IMAGE_URL: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'IMAGE_URL',
      },
    },
    {
      sequelize,
      tableName: 'PRF_PROFILE',
      timestamps: true,
    }
  );

  return Profile;
};

export default ProfileModel;
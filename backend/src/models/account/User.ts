import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
  userId: string;
  userName: string;
  profileId: string;
  email: string;
}

const UserModel = (sequelize: Sequelize) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public userId!: string;
    public userName!: string;
    public profileId!: string;
    public email!: string;

    static associate(models: any) {
      this.hasMany(models.Password, { foreignKey: 'userId', as: 'Password' });
      this.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' });
      this.hasOne(models.Tokens, { foreignKey: 'userId', as: 'tokens' })
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
    },
    {
      sequelize,
      tableName: 'USR_USERS',
      timestamps: true,
      createdAt: "CREATED_AT",
      updatedAt: "UPDATED_AT"
    }
  );

  return User;
};

export default UserModel;
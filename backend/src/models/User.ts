import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface UserAttributes {
  USER_ID: string;
  USER_NAME: string;
  USER_PROFILE_ID: string;
  USER_EMAIL: string;
}

const UserModel = (sequelize: Sequelize) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public USER_ID!: string;
    public USER_NAME!: string;
    public USER_PROFILE_ID!: string;
    public USER_EMAIL!: string;

    static associate(models: any) {
      this.hasMany(models.Password, { foreignKey: 'USER_ID' });
      this.belongsTo(models.Profile, { foreignKey: 'USER_PROFILE_ID' })
    }
  }

  User.init(
    {
      USER_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'USER_ID',
      },
      USER_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'USER_NAME',
      },
      USER_PROFILE_ID: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        field: 'USER_PROFILE_ID',
      },
      USER_EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'USER_EMAIL',
      },
    },
    {
      sequelize,
      tableName: 'USR_USERS',
      timestamps: true,
    }
  );

  return User;
};

export default UserModel;
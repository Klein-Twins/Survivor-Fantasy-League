import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PasswordAttributes {
  passwordSeq: number; // Primary key that auto-increments
  userId: string;      // Composite primary key
  password: string;     // The hashed password
  active: boolean;      // The active password
}

const PasswordModel = (sequelize: Sequelize) => {
  class Password extends Model<PasswordAttributes> implements PasswordAttributes {
    public passwordSeq!: number;
    public userId!: string;
    public password!: string;
    public active!: boolean;

    static associate(models: any) {
      this.belongsTo(models.User, { foreignKey: 'USER_ID', as: 'User' });
    }
  }

  Password.init(
    {
      passwordSeq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'PASSWORD_SEQ',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'USER_ID',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'PASSWORD',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'ACTIVE'
      }
    },
    {
      sequelize,
      tableName: 'USR_PASSWORDS',
      timestamps: true,
    }
  );

  return Password;
};

export default PasswordModel;
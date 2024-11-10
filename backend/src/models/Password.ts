import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PasswordAttributes {
  PASSWORD_SEQ: number; // Primary key that auto-increments
  USER_ID: string;      // Composite primary key
  PASSWORD: string;     // The hashed password
  ACTIVE: boolean;      // The active password
}

const PasswordModel = (sequelize: Sequelize) => {
  class Password extends Model<PasswordAttributes> implements PasswordAttributes {
    public PASSWORD_SEQ!: number;
    public USER_ID!: string;
    public PASSWORD!: string;
    public ACTIVE!: boolean;

    static associate(models: any) {
      this.belongsTo(models.User, { foreignKey: 'USER_ID', as: 'User' });
    }
  }

  Password.init(
    {
      PASSWORD_SEQ: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'PASSWORD_SEQ',
      },
      USER_ID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'USER_ID',
      },
      PASSWORD: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'PASSWORD',
      },
      ACTIVE: {
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
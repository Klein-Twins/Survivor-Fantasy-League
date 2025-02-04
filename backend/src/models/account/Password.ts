import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserAttributes } from './User';

export interface PasswordAttributes {
  passwordSeq: number; // Primary key that auto-increments
  userId: UserAttributes['userId']; // Composite primary key
  password: string; // The hashed password
  active: boolean; // The active password
}

const PasswordModel = (sequelize: Sequelize) => {
  class Password extends Model<PasswordAttributes> implements PasswordAttributes {
    public passwordSeq!: PasswordAttributes['passwordSeq'];
    public userId!: PasswordAttributes['userId'];
    public password!: PasswordAttributes['password'];
    public active!: PasswordAttributes['active'];

    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'userId',
        as: 'User',
      });
    }
  }

  Password.init(
    {
      passwordSeq: {
        type: DataTypes.INTEGER,
        primaryKey: false,
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
        field: 'ACTIVE',
      },
    },
    {
      sequelize,
      tableName: 'USR_PASSWORDS',
      timestamps: true,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      indexes: [
        {
          unique: true,
          fields: ['USER_ID', 'PASSWORD_SEQ'],
        },
      ],
    }
  );

  return Password;
};

export default PasswordModel;

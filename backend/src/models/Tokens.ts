import { DataTypes, Model, Sequelize } from 'sequelize';

export interface TokenAttributes {
  accessToken?: string | null;
  refreshToken?: string | null;
  userId: string;
}

const TokensModel = (sequelize: Sequelize) => {
  class Tokens extends Model<TokenAttributes> implements TokenAttributes {
    public accessToken?: string | null;
    public refreshToken?: string | null;
    public userId!: string;

    static associate(models: any) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }

  Tokens.init(
    {
      accessToken: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'ACCESS_TOKEN',
      },
      refreshToken: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'REFRESH_TOKEN',
      },
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'USER_ID',
      }
    },
    {
      sequelize,
      tableName: 'ATH_TOKENS',
      timestamps: true,
    }
  );

  return Tokens;
};

export default TokensModel;
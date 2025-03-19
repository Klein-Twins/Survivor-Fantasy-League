import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserAttributes } from './User';

export type TokenType = 'access' | 'refresh';

export interface TokenAttributes {
  token: string;
  userId: UserAttributes['userId'];
  tokenType: TokenType;
  tokenExpiresTime: Date;
  isActive: boolean;
}

const TokensModel = (sequelize: Sequelize) => {
  class Tokens extends Model<TokenAttributes> implements TokenAttributes {
    public token!: TokenAttributes['token'];
    public userId!: TokenAttributes['userId'];
    public tokenType!: TokenAttributes['tokenType'];
    public tokenExpiresTime!: TokenAttributes['tokenExpiresTime'];
    public isActive!: TokenAttributes['isActive'];

    static associate(models: any) {}
  }

  Tokens.init(
    {
      token: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'TOKEN',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'USER_ID',
      },
      tokenType: {
        type: DataTypes.ENUM('access', 'refresh'),
        allowNull: false,
        field: 'TOKEN_TYPE',
      },
      tokenExpiresTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'TOKEN_EXPIRES_TIME',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'IS_ACTIVE',
      },
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

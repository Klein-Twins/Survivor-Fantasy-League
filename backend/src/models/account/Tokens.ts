import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserAttributes } from './User';
import { UserSessionAttributes } from '../userSession/userSessions';
import logger from '../../config/logger';

export type TokenType = 'access' | 'refresh';

export interface TokenAttributes {
  token: string;
  userSessionId: UserSessionAttributes['id'];
  tokenType: TokenType;
  seq: number;
  issuedAt: Date;
  tokenExpiresTime: Date;
  isActive: boolean;
  tokenEndTime: Date | null;
}

const TokensModel = (sequelize: Sequelize) => {
  class Tokens extends Model<TokenAttributes> implements TokenAttributes {
    public token!: TokenAttributes['token'];
    public userSessionId!: TokenAttributes['userSessionId'];
    public seq!: TokenAttributes['seq'];
    public tokenType!: TokenAttributes['tokenType'];
    public tokenExpiresTime!: TokenAttributes['tokenExpiresTime'];
    public isActive!: TokenAttributes['isActive'];
    public issuedAt!: Date;
    public tokenEndTime!: Date | null;

    static associate(models: any) {
      if (models.UserSessions) {
        this.belongsTo(models.UserSessions, {
          foreignKey: 'userSessionId',
          targetKey: 'id',
          as: 'userSession',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Tokens with UserSessions');
      }
    }
  }

  Tokens.init(
    {
      token: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'TOKEN',
      },
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'ISSUED_AT',
        defaultValue: DataTypes.NOW,
      },
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEQ',
      },
      userSessionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'USER_SESSION_ID',
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
      tokenEndTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'TOKEN_END_TIME',
      },
    },
    {
      sequelize,
      tableName: 'ATH_TOKENS',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['USER_SESSION_ID', 'TOKEN_TYPE', 'TOKEN'],
          name: 'idx_user_session_token_type',
        },
        {
          unique: true,
          fields: ['USER_SESSION_ID', 'TOKEN_TYPE', 'SEQ'],
          name: 'idx_user_session_token_type_seq',
        },
      ],
    }
  );

  return Tokens;
};

export default TokensModel;

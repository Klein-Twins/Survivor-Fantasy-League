import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickTypeEnum } from './PCK_PICK_TYPE';

export enum ProfilePickAnswerStatus {
  correct = 'correct',
  incorrect = 'incorrect',
  answered = 'answered',
  pending = 'pending',
}

export interface ProfilePickAttributes {
  pickId: UUID;
  leagueProfileId: string;
  leagueId: UUID;
  episodeId: UUID;
  pickOptionType: PickTypeEnum;
  pickAnswerSurvivorId?: UUID | null;
  pickAnswerTribeId: UUID | null;
  pickAnswerBinary: boolean | null;
  pickAnswerCustom: string | null;
  pickAnswerStatus: ProfilePickAnswerStatus;
}

const ProfilePickModel = (sequelize: Sequelize) => {
  class ProfilePick extends Model<ProfilePickAttributes> implements ProfilePickAttributes {
    public pickId!: UUID;
    public leagueProfileId!: string;
    public leagueId!: UUID;
    public episodeId!: UUID;
    public pickAnswerSurvivorId!: UUID | null;
    public pickAnswerTribeId!: UUID | null;
    public pickAnswerBinary!: boolean | null;
    public pickAnswerCustom!: string | null;
    public pickOptionType!: PickTypeEnum;
    public pickAnswerStatus!: ProfilePickAnswerStatus;

    static associate(models: any) {
      this.belongsTo(models.Picks, { foreignKey: 'pickId', as: 'pick' });
      this.belongsTo(models.LeagueProfile, { foreignKey: 'leagueProfileId', as: 'leagueProfile' });
      this.belongsTo(models.League, { foreignKey: 'leagueId', as: 'league' });
      this.belongsTo(models.Episode, { foreignKey: 'episodeId', as: 'episode' });
    }
  }

  ProfilePick.init(
    {
      pickId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'PICK_ID',
      },
      leagueProfileId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'PROFILE_ID',
      },
      leagueId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'LEAGUE_ID',
      },
      episodeId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'EPISODE_ID',
      },
      pickOptionType: {
        type: DataTypes.ENUM(...Object.values(PickTypeEnum)),
        allowNull: false,
        field: 'PICK_OPTION_TYPE',
      },
      pickAnswerSurvivorId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'PICK_ANSWER_SURVIVOR_ID',
      },
      pickAnswerTribeId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'PICK_ANSWER_TRIBE_ID',
      },
      pickAnswerBinary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'PICK_ANSWER_BINARY',
      },
      pickAnswerCustom: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'PICK_ANSWER_CUSTOM',
      },
      pickAnswerStatus: {
        type: DataTypes.ENUM(...Object.values(ProfilePickAnswerStatus)),
        allowNull: false,
        field: 'PICK_ANSWER_STATUS',
      },
    },
    {
      sequelize,
      tableName: 'PCK_PROFILE_PICKS',
    }
  );

  return ProfilePick;
};

export default ProfilePickModel;

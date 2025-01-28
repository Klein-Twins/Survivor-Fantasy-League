import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export enum ProfilePickAnswerStatus {
  correct = 'correct',
  incorrect = 'incorrect',
  answered = 'answered',
  pending = 'pending',
}

export interface ProfilePickAttributes {
  pickId: UUID;
  profileId: UUID;
  leagueId: UUID;
  episodeId: UUID;
  pickAnswerSurvivorId?: UUID | null;
  pickAnswerTribeId: UUID | null;
  pickAnswerBinary: boolean | null;
  pickAnswerCustom: string | null;
  pickAnswerStatus: ProfilePickAnswerStatus;
}

const ProfilePickModel = (sequelize: Sequelize) => {
  class ProfilePick extends Model<ProfilePickAttributes> implements ProfilePickAttributes {
    public pickId!: UUID;
    public profileId!: UUID;
    public leagueId!: UUID;
    public episodeId!: UUID;
    public pickAnswerSurvivorId!: UUID | null;
    public pickAnswerTribeId!: UUID | null;
    public pickAnswerBinary!: boolean | null;
    public pickAnswerCustom!: string | null;
    public pickAnswerStatus!: ProfilePickAnswerStatus;

    static associate(models: any) {
      // this.belongsTo(models.Picks, { foreignKey: 'pickId', as: 'pick' });
      // this.belongsTo(models.Profiles, { foreignKey: 'profileId', as: 'profile' });
      // this.belongsTo(models.Leagues, { foreignKey: 'leagueId', as: 'league' });
      // this.belongsTo(models.Episodes, { foreignKey: 'episodeId', as: 'episode' });
      // this.belongsTo(models.PickOptions, { foreignKey: 'pickAnswerSurvivorId', as: 'pickAnswerSurvivor' });
      // this.belongsTo(models.PickOptions, { foreignKey: 'pickAnswerTribeId', as: 'pickAnswerTribe' });
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
      profileId: {
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
      pickAnswerSurvivorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'SURVIVOR_ANSWER',
      },
      pickAnswerTribeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'TRIBE_ANSWER',
      },
      pickAnswerBinary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'BINARY_ANSWER',
      },
      pickAnswerCustom: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: 'CUSTOM_ANSWER',
      },
      pickAnswerStatus: {
        type: DataTypes.ENUM,
        values: Object.values(ProfilePickAnswerStatus),
        allowNull: false,
        defaultValue: ProfilePickAnswerStatus.pending,
        field: 'PICK_ANSWER_STATUS',
      },
    },
    {
      sequelize,
      tableName: 'PCK_PROFILE_PICKS',
      timestamps: true,
    }
  );
  return ProfilePick;
};

export default ProfilePickModel;

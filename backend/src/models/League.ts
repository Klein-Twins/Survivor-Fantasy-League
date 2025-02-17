import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface LeagueAttributes {
    leagueId: string;
    seasonId: number;
    name: string;
    createdAt?: Date
}

interface LeagueOptionalAttributes {
    
}

const LeagueModel = (sequelize: Sequelize) => {
    class League extends Model<LeagueAttributes, LeagueOptionalAttributes> implements LeagueAttributes {
        public leagueId!: string;
        public seasonId!: number;
        public name!: string;
        public createAt?: Date;

        static associate(models: any) {
            this.belongsTo(models.Seasons, { foreignKey: 'seasonId', as: "season"});
            this.hasMany(models.LeagueProfile, {foreignKey: 'leagueId', as: "leagueProfiles"});
        }
    }

    League.init(
        {
            leagueId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: 'LEAGUE_ID'
            },
            seasonId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'SEASON_ID'
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: 'NAME'
            }
        },
        {
            sequelize,
            tableName: 'LGE_LEAGUE',
            timestamps: true,
        }
    );

    return League;
};

export default LeagueModel;
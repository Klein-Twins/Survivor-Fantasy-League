import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface LeagueAttributes {
    leagueId: number;
    seasonId: number;
    name: string;
    createdAt?: Date
}

interface LeagueOptionalAttributes {
    
}

const LeaguesModel = (sequelize: Sequelize) => {
    class League extends Model<LeagueAttributes, LeagueOptionalAttributes> implements LeagueAttributes {
        public leagueId!: number;
        public seasonId!: number;
        public name!: string;
        public createAt?: Date;

        static associate(models: any) {
            this.belongsTo(models.Seasons, { foreignKey: 'seasonId', as: "season"});
        }
    }

    League.init(
        {
            leagueId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            tableName: 'LGE_LEAGUES',
            timestamps: true,
        }
    );

    return League;
};

export default LeaguesModel;
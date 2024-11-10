import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface LeagueAttributes {
    LEAGUE_ID: number;
    SEASON_ID: number;
    NAME: string;
}

interface LeagueOptionalAttributes {
    
}

const LeaguesModel = (sequelize: Sequelize) => {
    class League extends Model<LeagueAttributes, LeagueOptionalAttributes> implements LeagueAttributes {
        public LEAGUE_ID!: number;
        public SEASON_ID!: number;
        public NAME!: string;

        static associate(models: any) {
            this.belongsTo(models.Seasons, { foreignKey: 'SEASON_ID' });
        }
    }

    League.init(
        {
            LEAGUE_ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'LEAGUE_ID'
            },
            SEASON_ID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'SEASON_ID'
            },
            NAME: {
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
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface LeagueAttributes {
    LEAGUE_ID: number;
    SEASON_ID: number;
    NAME: string;
    CREATED_AT: Date
}

interface LeagueOptionalAttributes {
    
}

const LeaguesModel = (sequelize: Sequelize) => {
    class League extends Model<LeagueAttributes, LeagueOptionalAttributes> implements LeagueAttributes {
        public LEAGUE_ID!: number;
        public SEASON_ID!: number;
        public NAME!: string;
        public CREATED_AT!: Date;

        static associate(models: any) {
            this.belongsTo(models.Seasons, { foreignKey: 'SEASON_ID', as: "SEASON"});
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
            },
            CREATED_AT: {
                type: DataTypes.DATE,
                field: 'CREATED_AT',  // Custom createdAt column name
                allowNull: false,
                defaultValue: DataTypes.NOW,  // Automatically set the current timestamp when created
            }
        },
        {
            sequelize,
            tableName: 'LGE_LEAGUES',
            timestamps: true,
            createdAt: 'CREATED_AT',
            updatedAt: false
        }
    );

    return League;
};

export default LeaguesModel;
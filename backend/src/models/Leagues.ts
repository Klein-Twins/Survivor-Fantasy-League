import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Define all attributes for the League model
export interface LeagueAttributes {
    LEAGUE_ID: number; // Primary key that auto-increments
    SEASON_ID: number;
    NAME: string;
}

// Define optional attributes for League creation (LEAGUE_ID is optional)
export interface LeagueOptionalAttributes extends Optional<LeagueAttributes, 'LEAGUE_ID'> {}

// Define the League model class
export class League extends Model<LeagueAttributes, LeagueOptionalAttributes> 
    implements LeagueAttributes {
    public LEAGUE_ID!: number;
    public SEASON_ID!: number;
    public NAME!: string;

    static associate(models: any) {
        this.belongsTo(models.Seasons, { foreignKey: 'SEASON_ID' });
    }
}

// Initialize the model
const LeagueModel = (sequelize: Sequelize) => {
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

export default LeagueModel;

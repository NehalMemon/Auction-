import dbConfig from '../config/config.js';
const { sequelizeTZ, DataTypes, Model } = dbConfig;

class teamModel extends Model {

    static associate(models) {
        // Use 'models.Owner' (Matches index.js key)
        teamModel.belongsTo(models.Owner, {
            foreignKey: 'ownerId',
            as: 'owner',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Use 'models.Player' (Matches index.js key)
        // Changed alias to PLURAL 'players'
        teamModel.hasMany(models.Player, {
            foreignKey: 'teamId',
            as: 'players',
            onDelete: 'SET NULL', 
            onUpdate: 'CASCADE'
        });
    }
}

teamModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    teamLogo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    playerCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
},
    {
        sequelize: sequelizeTZ,
        modelName: 'Team', // Capitalized
        tableName: 'teams',
        timestamps: true,
        paranoid: true
    });

export default teamModel;
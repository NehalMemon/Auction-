import dbConfig from '../config/config.js';
const { sequelizeTZ, DataTypes, Model } = dbConfig;

class playerModel extends Model {

    static associate(models) {
        // Use 'models.Team'
        playerModel.belongsTo(models.Team, {
            foreignKey: 'teamId',
            as: 'team',
            onDelete: 'SET NULL', 
            onUpdate: 'CASCADE'
        });
    }
}

playerModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    playerImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    playingStyle: {
        type: DataTypes.ENUM,
        values: ['right-handed', 'left-handed'],
        defaultValue: 'right-handed',
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM,
        values: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper-batsman'],
        defaultValue: 'Batsman',
        allowNull: false,
    },
    battingOrder: {
        type: DataTypes.ENUM,
        values: ['Top-order', 'Middle-order', 'Lower-order'],
        defaultValue: 'Top-order',
        allowNull: true, // ✅ Fixed 'ture' to 'true'
    },
    bowlingType: {
        type: DataTypes.ENUM,
        values: ['Fast', 'Medium', 'Spin'],
        defaultValue: 'Fast',
        allowNull: true,
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isSold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    soldPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    auctionCategory: {
        type: DataTypes.ENUM,
        values: ['Platinum', 'Diamond', 'Gold', 'Silver'],
        defaultValue: 'Silver',
        allowNull: false,
    }
}, {
    sequelize: sequelizeTZ,
    modelName: 'Player', 
    tableName: 'players',
    timestamps: true,
    paranoid: true
});

export default playerModel;
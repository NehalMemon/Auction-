import dbConfig from '../config/config.js';
const { sequelizeTZ, DataTypes, Model } = dbConfig;

class ownerModel extends Model {
    static associate(models) {
        ownerModel.hasOne(models.Team, {
            foreignKey: 'ownerId',
            as: 'owner',
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE'
        });
    }
}

ownerModel.init({
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
    isOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }

},
    {
        sequelize: sequelizeTZ,
        modelName: 'Owner',
        tableName: 'owners',
        timestamps: true,
        paranoid: true
    });

export default ownerModel;
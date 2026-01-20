import dbConfig from '../config/config.js';
const {sequelizeTZ,DataTypes, Model} = dbConfig;

class refreshTokenModel extends Model{
    static associate(models){
        refreshTokenModel.belongsTo(models.Admin,{
            foreignKey:'UserId',
            as:'user',
            onDelete:'CASCADE',
            onUpdate:'CASCADE'
        });    
    }
}

refreshTokenModel.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    token:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    userId:{
        type:DataTypes.STRING,
        
    },
    expiryDate:{
        type:DataTypes.DATE,
        allowNull:false,
    }
},

{
    sequelize:sequelizeTZ,
    modelName:'RefreshToken',
    tableName:'refresh_tokens',
    timestamps:true,
});

export default refreshTokenModel;
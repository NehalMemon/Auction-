import dbConfig from '../config/config.js';
const {sequelizeTZ,DataTypes, Model} = dbConfig;

class adminModel extends Model{}

adminModel.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
},
{
    sequelize:sequelizeTZ,
    modelName:'Admin',
    tableName:'admins',
    timestamps:true,
    paranoid:true 
});

export default adminModel;
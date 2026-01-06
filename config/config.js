import dotenv from 'dotenv';
import { Sequelize,DataTypes,Model } from 'sequelize';
dotenv.config();

const DB_NAME=process.env.DB_NAME;
const DB_USER=process.env.DB_USER;
const DB_PASSWORD=process.env.DB_PASSWORD;

const config = {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    host:process.env.DB_HOST || 'localhost',
    dialect:'mysql',
    port:process.env.DB_PORT || 3306
}


const sequelizeTZ = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host:config.host,
    dialect:config.dialect,
    port:config.port
});

sequelizeTZ.authenticate()
    .then(() => {
        console.log('✅ Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('❌ Unable to connect to the database:', error);
    });

const connection = {};

connection.sequelizeTZ = sequelizeTZ;
connection.Sequelize = Sequelize;
connection.DataTypes = DataTypes;
connection.Model = Model;

export default connection;
import dbConfig from '../config/config.js';

// Import Models
import teamModel from './teamModel.js';
import playerModel from './playerModel.js';
import ownerModel from './ownerModel.js'; 
import adminModel from './adminModel.js'; 
import refreshTokenModel from './refreshTokenModel.js';

const db = {};

// Register models with Capitalized Keys (Standard Convention)
db.Team = teamModel;
db.Player = playerModel;
db.Owner = ownerModel; 
db.Admin = adminModel;
db.RefreshToken = refreshTokenModel;

// Initialize Associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = dbConfig.sequelizeTZ;
db.Sequelize = dbConfig.Sequelize;

export default db;
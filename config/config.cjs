require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: 'mysql',
   dialectOptions: {
      ssl: {
        // This is the specific requirement for TiDB Cloud Serverless
        rejectUnauthorized: true,
      },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: 'mysql',
    dialectOptions: {
     ssl: {
        // This is the specific requirement for TiDB Cloud
        rejectUnauthorized: true, 
      }
    }
  }},
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        // This is the specific requirement for TiDB Cloud
        rejectUnauthorized: true, 
      }
    }
  }
}
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Expect DATABASE_URL in the form:
// postgres://user:password@host:port/dbname?sslmode=require
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Neon requires SSL
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

module.exports = { sequelize };

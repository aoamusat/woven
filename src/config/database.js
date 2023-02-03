const Sequelize = require('sequelize');

const Database = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }
);

module.exports = Database;
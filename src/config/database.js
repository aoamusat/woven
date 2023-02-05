const Sequelize = require("sequelize");
require("dotenv").config();

const Database = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        logging: false,
        dialect: "mysql",
        dialectOptions: {
            socketPath: process.env.SOCKET_PATH,
        },
    }
);

module.exports = Database;

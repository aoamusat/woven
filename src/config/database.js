const Sequelize = require("sequelize");
require("dotenv").config();

const Database = new Sequelize("woven", "woven", "woven", {
    host: "localhost",
    logging: false,
    dialect: "mysql",
    dialectOptions: {
        socketPath: "/tmp/mysql.sock",
    },
});

module.exports = Database;

const Database = require("../config/database");
const sequelize = require("sequelize");

const Contract = Database.define("contracts", {
    title: {
        type: sequelize.STRING,
        allowNull: false,
    },
    terms: {
        type: sequelize.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize.ENUM("new", "in_progress", "terminated"),
        allowNull: false,
        defaultValue: "new",
    },
});

module.exports = Contract;

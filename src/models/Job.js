const Database = require("../config/database");
const sequelize = require("sequelize");

const Job = Database.define("jobs", {
    title: {
        type: sequelize.STRING,
        allowNull: false,
    },
    paid: {
        type: sequelize.BOOLEAN,
        default: false,
    },
    price: {
        type: sequelize.DECIMAL(12, 2),
        allowNull: false,
    },
    paymentDate: {
        type: sequelize.DATE,
    },
});

module.exports = Job;

const Database = require("../config/database");
const sequelize = require("sequelize")

const Contract = Database.define('contracts', {
  name: {
    type: sequelize.INTEGER,
    allowNull: false
  },
});

module.exports = Contract;
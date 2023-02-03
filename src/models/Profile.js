const Database = require("../config/database");
const sequelize = require("sequelize");

const Profile = Database.define('profiles', {
  name: {
    type: sequelize.INTEGER,
    allowNull: false
  },
});

module.exports = Profile;
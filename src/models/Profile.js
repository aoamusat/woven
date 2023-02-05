const Database = require("../config/database");
const sequelize = require("sequelize");
const Contract = require("./Contract");
const Job = require("./Job");

const Profile = Database.define("profiles", {
    name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize.ENUM("client", "contractor"),
        allowNull: false,
    },
    balance: {
        type: sequelize.DECIMAL(12, 2),
        allowNull: false,
        default: 0.0,
    },
    profession: {
        type: sequelize.STRING,
        allowNull: false,
    },
});

// Define a relationship between Profile and Contract where a Profile is acting as a contractor
Profile.hasMany(Contract, { as: "Contractor", foreignKey: "ContractorId" });
Contract.belongsTo(Profile, { as: "Contractor" });

// Define a relationship between Profile and Contract where a Profile is acting as a client
Profile.hasMany(Contract, { as: "Client", foreignKey: "ClientId" });
Contract.belongsTo(Profile, { as: "Client" });

Contract.hasMany(Job);
Job.belongsTo(Contract);

Database.sync()
    .then(() => {
        console.log("Models synced with the database!");
    })
    .catch((error) => {
        console.error("An error has occured :", error);
    });

module.exports = Profile;

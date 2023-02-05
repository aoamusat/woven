const { Sequelize } = require("sequelize");
const Contract = require("../models/Contract");
/**
 * Returns a contract by id only if it belongs to the current profile
 *
 * @param {Request} request
 * @param {Response} response
 * @returns {Contract} contract by id
 */
const getContract = async (request, response) => {
    const { id } = request.params;
    const profile = request.user;
    const contract = await Contract.findOne({
        where: {
            id: id,
            [Sequelize.Op.or]: {
                ContractorId: profile.id,
                ClientId: profile.id,
            },
        },
    });

    if (!contract) {
        return response.status(404).send({ message: "Not Found!" });
    }

    response.send(contract);
};

/**
 * Returns a list of contracts belonging to a user (client or contractor),
 * The list should only contain non terminated contracts.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns {Contract[]} contracts
 */
const allContracts = async (request, response) => {
    const profile = request.user;
    const contracts = await Contract.findAll({
        where: {
            status: { [Sequelize.Op.ne]: "terminated" },
            [Sequelize.Op.or]: {
                ContractorId: profile.id,
                ClientId: profile.id,
            },
        },
    });

    response.send(contracts);
};

module.exports = { getContract, allContracts };

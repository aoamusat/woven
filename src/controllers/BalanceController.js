const { Sequelize } = require("sequelize");
const Database = require("../config/database");
const Contract = require("../models/Contract");
const Job = require("../models/Job");
const Profile = require("../models/Profile");

/**
 * Deposits money into the balance of a client
 * A client can't deposit more than 25% his total of jobs to pay.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns
 */

const deposit = async (request, response) => {
    const deposit_amount = request.body.amount;
    const { userId } = request.params;

    if (!deposit_amount) {
        return response.status(400).json({
            message: "Missing required body parameter amount",
        });
    }

    if (deposit_amount < 0) {
        return response.status(400).json({
            message: "Deposit amount must be a positive number",
        });
    }

    if (deposit_amount > request.user.balance) {
        return response.status(400).json({
            message: "You do not have enough balance to make this deposit",
        });
    }
    const user = await Profile.findByPk(userId);

    if (!user) {
        return res.status(404).json({
            message: "User ID does not exist",
        });
    }

    const contracts = await Contract.findAll({
        where: {
            ClientId: request.user.id,
            "$Jobs.paid$": {
                [Sequelize.Op.eq]: false,
            },
        },
        attributes: [
            [Sequelize.fn("SUM", Sequelize.col("Jobs.price")), "total_owed"],
        ],
        include: [
            {
                model: Job,
            },
        ],
        // group: ["ClientId"]
    });
    
    const {total_owed} = contracts[0].dataValues

    const max_deposit_amount = total_owed * 0.25;

    if (deposit_amount > max_deposit_amount) {
        return response.status(400).send({
            message: "Deposit amount cannot exceed 25% of jobs to pay",
            "max_deposit_amount": max_deposit_amount
        });
    }

    const transaction = await Database.transaction();

    try {
        await user.update(
            {
                balance: (user.balance += deposit_amount),
            },
            { transaction }
        );
        await request.user.update(
            {
                balance: (request.user.balance -= deposit_amount),
            },
            { transaction }
        );
        transaction.commit();
    } catch (e) {
        console.log(e);
        transaction.rollback();
        return response.status(500).json({
            message: "Internal Server Error",
        });
    }

    response.status(200).send({
        message: "Deposit Ok!",
    });
};

module.exports = { deposit };

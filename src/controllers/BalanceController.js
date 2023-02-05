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
    const amount = request.body.amount;
    const { userId } = request.params;

    if (!amount) {
        return response.status(400).json({
            message: "Missing required body parameter amount",
        });
    }

    if (amount < 0) {
        return response.status(400).json({
            message: "Deposit amount must be positive",
        });
    }

    if (amount > request.user.balance) {
        return response.status(400).json({
            message: "Insufficient balance!",
        });
    }

    const client = await Profile.findOne({
        where: { id: userId, type: "client" },
    });
    if (!client) return response.status(404);

    const totalOwed = await Job.sum("price", {
        where: {
            paid: false,
        },
        include: [
            {
                model: Contract,
                attributes: [],
                where: {
                    ClientId: request.user.id,
                },
            },
        ],
    });

    const MAX_DEPOSIT = totalOwed * 0.25;

    if (amount >= MAX_DEPOSIT) {
        return response.status(400).send({
            message:
                "You can't deposit more than 25% your total of jobs to pay.",
            MAX_DEPOSIT,
        });
    }

    const transaction = await Database.transaction();

    try {
        await request.user.decrement({ balance: amount });
        await client.increment({ balance: amount });
        await transaction.commit();
        return response.json({ message: "Deposit successful!" });
    } catch (error) {
        await transaction.rollback();
        return response.status(500).json({ message: "Failed to add balance" });
    }
};

module.exports = { deposit };

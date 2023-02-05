const { Sequelize } = require("sequelize");
const Database = require("../config/database");
const Contract = require("../models/Contract");
const Job = require("../models/Job");
const Profile = require("../models/Profile");

/**
 * Get all unpaid jobs for a user (a client or contractor)
 * For active contracts only
 *
 * @param {Request} request
 * @param {Response} response
 */
const getUnpaidJobs = async (request, response) => {
    const profile = request.user;

    const jobs = await Job.findAll({
        include: [
            {
                model: Contract,
                required: true,
                attributes: [
                    "id",
                    "title",
                    "status",
                    "ClientId",
                    "ContractorId",
                ],
                where: {
                    [Sequelize.Op.or]: {
                        ClientId: profile.id,
                        ContractorId: profile.id,
                    },
                    status: {
                        [Sequelize.Op.ne]: "terminated",
                    },
                },
            },
        ],
        where: {
            paid: { [Sequelize.Op.not]: true },
        },
    });

    return response.send(jobs);
};

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay.
 * The amount should be moved from the client's balance to the contractor balance
 *
 * @param {Request} request
 * @param {Response} response
 */
const payForJob = async (request, response) => {
    // const job = await Job.findByPk(request.params.job_id);
    const profile = request.user;
    const job = await Job.findOne({
        include: [
            {
                model: Contract,
                required: true,
                attributes: ["id", "ClientId", "ContractorId"],
                where: {
                    status: {
                        [Sequelize.Op.not]: "terminated",
                    },
                },
            },
        ],
        where: {
            id: request.params.job_id,
        },
    });

    if (!job) {
        return response.status(404).send({ message: "Job not found!" });
    }

    // Get contractor details
    const contactorProfile = await Profile.findByPk(job.contract.ContractorId);

    // has job been paid already?
    if (job.paid) {
        return response.status(200).send({ message: "Job paid" });
    }

    // Now check if the user has enough funds to pay
    if (Number(job.price) > Number(profile.balance))
        return response.status(400).json({
            message: `Not enough funds. Job costs ${job.price}. Available balance: ${profile.balance}.`,
        });

    // All set. Now we can initiate the payment transaction
    const transaction = await Database.transaction();
    try {
        await profile.update(
            {
                balance: profile.balance - job.price,
            },
            { transaction }
        );

        await contactorProfile.update(
            {
                balance: profile.balance + job.price,
            },
            { transaction }
        );

        await job.update(
            {
                paid: true,
                paymentDate: new Date(),
            },
            { transaction }
        );
        await transaction.commit();
    } catch (e) {
        console.error(e);
        transaction.rollback();
        return response.status(500).json({
            code: 500,
            message: "Internal server error",
        });
    }

    return response.status(200).send({ message: "Job paid. Ok!" });
};

module.exports = { getUnpaidJobs, payForJob };

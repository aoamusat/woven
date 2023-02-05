const { Sequelize } = require("sequelize");
const { parseISO, isBefore } = require("date-fns");
const Profile = require("../models/Profile");
const Contract = require("../models/Contract");
const Job = require("../models/Job");

/**
 * Returns the profession that earned the most money (sum of jobs paid)
 * For any contactor that worked in the query time range.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns
 */
const getBestProfession = async (request, response) => {
    const { start, end } = request.query;

    if (!start) {
        return response.status(400).json({
            message: "Start date is required",
        });
    }

    if (!end) {
        return response.status(400).json({
            message: "End date is required",
        });
    }

    if (isBefore(parseISO(end), parseISO(start))) {
        return response.status(400).json({
            message: "End date should come after start date",
        });
    }

    const startDate = parseISO(start);
    const endDate = parseISO(end);

    const jobs = await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Sequelize.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [Sequelize.fn("SUM", Sequelize.col("jobs.price")), "total_gained"],
        ],
        include: [
            {
                model: Contract,
                required: true,
                include: [
                    {
                        model: Profile,
                        as: "Client",
                        required: true,
                    },
                ],
            },
        ],
        group: ["Contract.Client.profession"],
        order: [["total_gained", "desc"]],
        raw: true,
    });
    
    // Get the first item from the array
    const top_paying = jobs.shift();
    
    return response.json({
        top_profession: top_paying,
    });
};

/**
 * Returns the clients the paid the most for jobs in the query time period.
 * Limit query parameter should be applied, default limit is 2.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns
 */
const getBestClients = async (request, response) => {
    const { start, end } = request.query;
    const limit = request.query.limit || 2;

    if (!start) {
        return response.status(400).json({
            message: "Start date is required",
        });
    }

    if (!end) {
        return response.status(400).json({
            message: "End date is required",
        });
    }

    if (isBefore(parseISO(end), parseISO(start))) {
        return response.status(400).json({
            message: "End date should come after start date",
        });
    }

    if (!limit) {
        return response.status(400).json({
            message: "Limit is required",
        });
    }

    const startDate = parseISO(start);
    const endDate = parseISO(end);

    const clients = await Profile.findAll({
        include: [
            {
                model: Contract,
                as: "Contractor",
                include: [
                    {
                        model: Job,
                        where: {
                            paid: true,
                            paymentDate: {
                                [Sequelize.Op.between]: [startDate, endDate],
                            },
                        },
                    },
                ],
            },
        ],
        attributes: [
            [
                Sequelize.fn("SUM", Sequelize.col("Contractor.Jobs.price")),
                "total_paid",
            ],
            "name",
            "id",
        ],
        order: [["total_paid", "desc"]],
        group: ["Contractor.id"],
    });

    return response.json(
        clients.slice(0, limit).map((client) => ({
            id: client.id,
            name: client.name,
        }))
    );
};

module.exports = { getBestProfession, getBestClients };

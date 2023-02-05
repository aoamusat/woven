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

    const profiles = await Profile.findAll({
        attributes: [
            "profession",
            [
                Sequelize.fn("SUM", Sequelize.col("Contractor.Jobs.price")),
                "total",
            ],
        ],
        group: ["profession"],
        order: Sequelize.literal("total DESC"),
        include: [
            {
                model: Contract,
                attributes: [],
                as: "Contractor",
                include: [
                    {
                        model: Job,
                        attributes: [],
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
    });
    if (profiles.length === 0) {
        return response.status(404).send({ message: "Not enough data" });
    }

    const profile = profiles.shift();

    response.status(200).send({
        profession: profile.profession,
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
    let { limit } = request.query;
    limit = Number.parseInt(limit);

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

    const profiles = await Profile.findAll({
        attributes: [
            "id",
            "name",
            [Sequelize.fn("SUM", Sequelize.col("price")), "paid"],
        ],
        group: [Sequelize.col("id")],
        order: Sequelize.literal("paid DESC"),
        limit,
        include: [
            {
                duplicating: false,
                model: Contract,
                attributes: [],
                as: "Client",
                required: true,
                include: [
                    {
                        model: Job,
                        duplicating: false,
                        attributes: [],
                        required: true,
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
    });
    if (profiles.length === 0) {
        return response.status(404).send({
            message: "Not found!",
        });
    }

    response.status(200).json(profiles);
};

module.exports = { getBestProfession, getBestClients };

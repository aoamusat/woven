const Contract = require("../models/Contract");
const Job = require("../models/Job");
const Profile = require("../models/Profile");
const { faker } = require("@faker-js/faker");

function getTwoRandomInts(min, max) {
    // Generate two random numbers within the range
    let num1 = Math.floor(Math.random() * (max - min + 1) + min);
    let num2 = Math.floor(Math.random() * (max - min + 1) + min);

    // Make sure the two numbers are distinct
    while (num1 === num2) {
        num2 = Math.floor(Math.random() * (max - min + 1) + min);
    }

    return [num1, num2];
}

const seed = async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    const profiles = [
        {
            id: 1,
            name: "John Doe",
            profession: "Developer",
            balance: Math.floor(Math.random() * 10000),
            type: "client",
        },
        {
            id: 2,
            name: "Jane Doe",
            profession: "Designer",
            balance: Math.floor(Math.random() * 10000),
            type: "client",
        },
        {
            id: 3,
            name: "Bob Smith",
            profession: "Manager",
            balance: Math.floor(Math.random() * 10000),
            type: "client",
        },
        {
            id: 4,
            name: "Alice Johnson",
            profession: "Marketing",
            balance: Math.floor(Math.random() * 10000),
            type: "client",
        },
        {
            id: 5,
            name: "Tom Wilson",
            profession: "Engineer",
            balance: Math.floor(Math.random() * 10000),
            type: "client",
        },
        {
            id: 6,
            name: "Sara Davis",
            profession: "Consultant",
            balance: Math.floor(Math.random() * 10000),
            type: "contractor",
        },
        {
            id: 7,
            name: "Tim Brown",
            profession: "Analyst",
            balance: Math.floor(Math.random() * 10000),
            type: "contractor",
        },
        {
            id: 8,
            name: "Emily Clark",
            profession: "Teacher",
            balance: Math.floor(Math.random() * 10000),
            type: "contractor",
        },
        {
            id: 9,
            name: "Michael Green",
            profession: "Writer",
            balance: Math.floor(Math.random() * 10000),
            type: "contractor",
        },
        {
            id: 10,
            name: "Jennifer Powell",
            profession: "Photographer",
            balance: Math.floor(Math.random() * 10000),
            type: "contractor",
        },
    ];

    // Insert the fake profiles into the database
    await Profile.bulkCreate(profiles);

    // Generate random contracts
    const contracts = Array.from({ length: 20 }, () => {
        let idx = Math.floor(Math.random() * 3);
        const indices = getTwoRandomInts(1, 10);

        return {
            title: faker.lorem.words(2),
            terms: faker.lorem.sentences(3, "\n"),
            status: ["new", "terminated", "in_progress"][idx],
            ClientId: indices[0],
            ContractorId: indices[1],
        };
    });

    await Contract.bulkCreate(contracts);

    const jobs = Array.from({ length: 30 }, () => {
        const idx = Math.floor(Math.random() * 2);
        const idx1 = Math.floor(Math.random() * 20) + 1;

        return {
            title: faker.lorem.words(2),
            paid: [true, false][idx],
            price: Math.floor(Math.random() * 1000),
            contractId: idx1,
        };
    });

    await Job.bulkCreate(jobs);
};

module.exports = seed;

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
    // Generate an array of 20 fake profiles
    const profiles = Array.from({ length: 20 }, () => {
        let idx = Math.floor(Math.random() * 2);
        return {
            name: faker.name.fullName(),
            type: ["client", "contractor"][idx],
            balance: Math.floor(Math.random() * 10000),
            profession: faker.name.jobTitle(),
        };
    });

    // Insert the fake profiles into the database
    await Profile.bulkCreate(profiles);

    const contracts = Array.from({ length: 20 }, () => {
        let idx = Math.floor(Math.random() * 3);
        const indices = getTwoRandomInts(1, 20);

        return {
            title: faker.lorem.words(2),
            terms: faker.lorem.sentences(3, "\n"),
            status: ["new", "terminated", "in_progress"][idx],
            ClientId: indices[0],
            ContractorId: indices[1],
        };
    });

    await Contract.bulkCreate(contracts);

    const jobs = Array.from({ length: 20 }, () => {
        let idx = Math.floor(Math.random() * 2);
        let idx1 = Math.floor(Math.random() * 20);

        return {
            title: faker.lorem.words(2),
            paid: [true, false][idx],
            price: Math.floor(Math.random() * 1000),
            contractId: idx1,
        };
    });

    await Job.bulkCreate(jobs);
};

seed();

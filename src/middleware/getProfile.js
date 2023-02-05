const Profile = require("../models/Profile");
require("dotenv").config();

/**
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
const authenticate = async (request, response, next) => {
    const { profile_id } = request.headers;
    const profile = await Profile.findByPk(profile_id);

    if (profile) {
        request.user = profile;
        return next();
    } else {
        response.status(401).json({
            message: "Not authorized!",
        });
    }
};

module.exports = { authenticate };

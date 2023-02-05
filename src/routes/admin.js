const { Router } = require("express");
const {
    getBestProfession,
    getBestClients,
} = require("../controllers/AdminController");
const { authenticate } = require("../middleware/getProfile");

const AdminRouter = Router();

AdminRouter.get("/best-profession", authenticate, getBestProfession);
AdminRouter.get("/best-clients", authenticate, getBestClients);

module.exports = AdminRouter;

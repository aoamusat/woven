const { Router } = require("express");
const { deposit } = require("../controllers/BalanceController");
const { authenticate } = require("../middleware/getProfile");

const BalanceRouter = Router();

BalanceRouter.post("/deposit/:userId", authenticate, deposit);

module.exports = BalanceRouter;

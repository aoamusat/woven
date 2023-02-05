const { Router } = require("express");
const { getContract, allContracts } = require("../controllers/APIController");
const { authenticate } = require("../middleware/getProfile");

const APIRouter = Router();

APIRouter.get("/contracts/:id", authenticate, getContract);
APIRouter.get("/contracts", authenticate, allContracts);

module.exports = APIRouter;

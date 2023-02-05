const { Router } = require("express");
const { getUnpaidJobs, payForJob } = require("../controllers/JobController");
const { authenticate } = require("../middleware/getProfile");

const JobRouter = Router();

JobRouter.get("/unpaid", authenticate, getUnpaidJobs);
JobRouter.get("/:job_id/pay", authenticate, payForJob);

module.exports = JobRouter;

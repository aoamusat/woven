const express = require("express");
const AdminRouter = require("./routes/admin");
const APIRouter = require("./routes/api");
const BalanceRouter = require("./routes/balance");
const JobRouter = require("./routes/job");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", APIRouter);
app.use("/admin", AdminRouter);
app.use("/jobs", JobRouter);
app.use("/balances", BalanceRouter);

module.exports = { app, PORT };

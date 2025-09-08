const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { success } = require("./util/response.util");
const connectDB = require("./config/db.config");

const authRoutes = require("./routes/auth.route");

const app = express();
connectDB();

app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.get("/health", (req, res) => {
  success({ res, message: "Intellecta is Running..." });
});

app.use("/auth", authRoutes);

module.exports = app;

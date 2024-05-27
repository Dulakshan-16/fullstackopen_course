const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const middlewear = require("./utils/middleware");
const logger = require("./utils/logger");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => logger.info("Connected to MongoDB"))
	.catch((error) =>
		logger.error("Error connecting to MongoDB:", error.message)
	);

app.use(cors());
app.use(express.json());
app.use(middlewear.requestLogger);
app.use(middlewear.tokenExtractor);

app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/login", loginRouter);

app.use(middlewear.unknownEndpoint);
app.use(middlewear.errorHandler);

module.exports = app;

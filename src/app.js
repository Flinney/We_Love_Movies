if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const moviesRouter = require("./movies/movies.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);

//Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;

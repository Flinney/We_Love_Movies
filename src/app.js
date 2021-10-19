if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

//routers
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");

//app
const app = express();

//cors and req.body object
app.use(cors());
app.use(express.json());

//routes
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);

//Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;

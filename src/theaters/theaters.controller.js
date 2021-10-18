const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");
const service = require("./theaters.service");

//middleware
async function formatTheaters(req, res, next) {
  const data = await service.list();
  const reduceMovies = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    rating: ["movies", null, "rating"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    is_showing: ["movies", null, "is_showing"],
  });
  res.locals.data = reduceMovies(data);
  next();
}

function list(req, res, next) {
  const data = res.locals.data;
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(formatTheaters), list],
};

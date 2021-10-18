const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

//middleware
const filterByIsShowing = (req, res, next) => {
  const showing = req.query.is_showing;
  res.locals.showing = showing ? showing : null;
  return next();
};

const isValidId = async (req, res, next) => {
  const { movieId } = req.params;
  if (!Number(movieId)) {
    return next({ status: 404, message: "Not a valid id." });
  }
  const movie = await service.read(Number(movieId));
  res.locals.movie = movie;
  return movie
    ? next()
    : next({ status: 404, message: "Movie cannot be found." });
};

async function list(req, res, next) {
  const data = res.locals.showing
    ? await service.listByIsShowing()
    : await service.list();
  console.log(data);
  res.json({ data });
}

function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

module.exports = {
  list: [filterByIsShowing, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(isValidId), read],
};

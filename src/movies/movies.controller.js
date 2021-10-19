const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

//middleware
const filterByIsShowing = (req, res, next) => {
  const showing = req.query.is_showing;
  res.locals.showing = showing ? showing : null;
  return next();
};

//converting movieId param to number before passing to service.
//early return if not valid.
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

//conditonal service call, keeping as much data logic in
//sql queries as possible. 
async function list(req, res, next) {
  const data = res.locals.showing
    ? await service.listByIsShowing()
    : await service.list();
  res.json({ data });
}

function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

module.exports = {
  list: [filterByIsShowing, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(isValidId), read],
  isValidId,
};

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

//middleware
const filterByIsShowing = (req, res, next) => {
  const showing = req.query.is_showing;
  res.locals.showing = showing ? showing : null;
  return next();
};

async function list(req, res, next) {
  const data = res.locals.showing
    ? await service.listByIsShowing()
    : await service.list();
  console.log(data);
  res.json({ data });
}

module.exports = {
  list: [filterByIsShowing, asyncErrorBoundary(list)],
};

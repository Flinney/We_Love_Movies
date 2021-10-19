const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");
const service = require("./reviews.service");

const VALID_REVIEW_PROPERTIES = ["content", "score"];

//declaring helper function to nest data
const mapReview = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//middleware
const isValidId = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  res.locals.review = review;
  return review
    ? next()
    : next({ status: 404, message: "Review cannot be found." });
};

const bodyHasValidProperties = (req, res, next) => {
  const props = Object.keys(req.body.data);
  return props.every((prop) => VALID_REVIEW_PROPERTIES.includes(prop))
    ? next()
    : next({ status: 404, message: "Not a valid property to update" });
};

//nesting critic data within review object
//sqlite3 does not support returning from queries, so the response
//object is created here with new review data updated conditonally
const createMappedReview = (req, res, next) => {
  const mappedReview = mapReview(res.locals.review);
  res.locals.mappedReview = mappedReview;

  if (req.body.data.content) {
    mappedReview.content = req.body.data.content;
  }
  if (req.body.data.score) {
    mappedReview.score = req.body.data.score;
  }

  return next();
};

//nesting critic data for array of reviews
const createMappedReviews = async (req, res, next) => {
  const { movieId } = req.params;
  const reviews = await service.list(movieId);

  const mappedReviews = reviews.map((review) => mapReview(review));

  res.locals.data = mappedReviews;
  next();
};

function read(req, res, next) {
  const data = res.locals.review;
  res.json({ data });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updatedReview);
  res.json({ data: res.locals.mappedReview });
}

async function destroy(req, res, next) {
  await service.delete(res.locals.review.review_id);
  res.sendStatus(204);
}

function list(req, res, next) {
  const data = res.locals.data;
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(isValidId), read],
  update: [
    asyncErrorBoundary(isValidId),
    bodyHasValidProperties,
    createMappedReview,
    update,
  ],
  delete: [asyncErrorBoundary(isValidId), destroy],
  list: [asyncErrorBoundary(createMappedReviews), list],
};

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");
const service = require("./reviews.service");

const VALID_REVIEW_PROPERTIES = ["content", "score"];

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

const createMappedReview = (req, res, next) => {
  const mapReview = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
  });

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

module.exports = {
  read: [asyncErrorBoundary(isValidId), read],
  update: [
    asyncErrorBoundary(isValidId),
    bodyHasValidProperties,
    createMappedReview,
    update,
  ],
};

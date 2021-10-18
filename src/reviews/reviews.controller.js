const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");
const service = require("./reviews.service");

//middleware
const isValidId = async (req, res, next) => {
  const { reviewId } = req.params;
  if (!Number(reviewId)) {
    return next({ status: 404, message: "Not a valid id." });
  }
  const review = await service.read(Number(reviewId));
  const mapReview = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
  });
  const mappedReview = mapReview(review);
  mappedReview["critic_id"] = mappedReview.critic.critic_id;
  res.locals.review = mappedReview;
  return review
    ? next()
    : next({ status: 404, message: "Review cannot be found." });
};

function read(req, res, next) {
  const data = res.locals.review;
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(isValidId), read],
};

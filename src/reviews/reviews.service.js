const knex = require("../db/connection");

function read(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.review_id": reviewId })
    .first();
}

module.exports = {
  read,
};

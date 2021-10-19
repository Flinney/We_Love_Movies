const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function listByIsShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.movie_id", "m.title", "m.rating", "m.description", "m.image_url")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id")
    .orderBy("m.movie_id");
}

function read(movieId) {
  return knex("movies as m")
    .select("*")
    .where({ "m.movie_id": movieId })
    .first();
}

module.exports = {
  list,
  listByIsShowing,
  read,
};

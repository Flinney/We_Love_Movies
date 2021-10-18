const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

async function listByIsShowing() {
  const data = knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.movie_id", "m.title", "m.rating", "m.description", "m.image_url")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id")
    .orderBy("m.movie_id");
  console.log(data);
  return data;
}

module.exports = {
  list,
  listByIsShowing,
};

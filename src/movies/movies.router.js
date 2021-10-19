const router = require("express").Router();
const theatersRouter = require("../theaters/theaters.router");
const reviewsRouter = require("../reviews/reviews.router");
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//isValidId checks for valid movieId param before passing to nested routes
router.use("/:movieId/theaters", controller.isValidId, theatersRouter);

router.use("/:movieId/reviews", controller.isValidId, reviewsRouter);

router.route("/:movieId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;

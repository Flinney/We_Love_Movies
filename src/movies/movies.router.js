const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").all(methodNotAllowed);

module.exports = router;

const express = require("express");
const restaurantController = require("./restaurant.controller");
const authenticate = require("../auth/auth.middleware");

const router = express.Router();

router.get("/", restaurantController.list);
router.post("/", authenticate, restaurantController.create);

module.exports = router;

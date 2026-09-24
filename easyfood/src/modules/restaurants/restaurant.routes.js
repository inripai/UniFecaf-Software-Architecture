const express = require("express");
const restaurantController = require("./restaurant.controller");

const router = express.Router();

router.get("/", restaurantController.list);
router.post("/", restaurantController.create);

module.exports = router;

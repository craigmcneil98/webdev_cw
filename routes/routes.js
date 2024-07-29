const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");

router.get("/", controller.landing_page);
router.get("/products", controller.products_page);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");

router.get("/", controller.landing_page);
router.get("/products", controller.products_page);
router.post('/products/delete/:id', controller.delete_product);

module.exports = router;
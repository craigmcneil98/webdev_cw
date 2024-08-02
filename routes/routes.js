const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");
const userController = require("../controllers/userController.js")

//Rendering
router.get("/", controller.landing_page);
router.get("/login", controller.login_page);
router.get("/register", controller.register_page);
router.get("/products", controller.products_page);
router.get("/details/:id", controller.details_page);

//Authentication
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/register', userController.register);


//Product Control
router.get('/products/delete/:id', userController.verifyAdmin, controller.delete_product);
router.post('/products/update/:id', userController.verifyAdmin, controller.update_product);

module.exports = router;
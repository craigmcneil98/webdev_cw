const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");
const userController = require("../controllers/userController.js")

//Rendering
router.get("/", userController.getUserData, controller.landing_page);
router.get("/login", controller.login_page);
router.get("/products", userController.getUserData, controller.products_page);
router.get("/admin", userController.verifyAdmin, controller.admin_page);
router.get("/products/details/:id", userController.verify, controller.details_page);
router.get("/products/add", userController.verify, controller.add_product_page)
router.get("/access-denied", userController.getUserData, controller.access_denied)

//Authentication
router.post('/login', userController.login);
router.get('/logout', userController.logout);

//User Control
router.post('/admin/create-user', userController.verifyAdmin, userController.register);
router.get('/admin/delete-user/:id', userController.verifyAdmin, userController.delete_user);

//Product Control
router.post("/products/add/submit", userController.verify, controller.add_product)
router.get('/products/delete/:id', userController.verify, controller.delete_product);
router.post('/products/update/:id', userController.verify, controller.update_product);

module.exports = router;
const productDao = require('../models/productModel.js');
const userController = require('./userController');
const product_db = new productDao({ filename: "products.db", autoload: true });
product_db.init();

exports.landing_page = function (req, res) {
    res.render("landing", {
        title: "About Us"
    });
};

// Render login page
exports.login_page = function (req, res) {
    res.render("user/login");
};

// Render registration page
exports.register_page = function (req, res) {
    res.render("user/register");
};

// Render and populate the products page
exports.products_page = async function (req, res) {
    try {
        const products = await product_db.getAllProducts();
        res.render("products", {
            title: "Products",
            products: products
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
};

exports.edit_product_page = async function (req, res) {
    try {
        const product = await product_db.getProductById(req.id);
        res.render("edit_product", {
            title: "Edit Product",
            product: product
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Function to delete product listings
exports.delete_product = async function (req, res) {
    try {   
        const productId = req.params.id;
        const numRemoved = await product_db.deleteProduct(productId);
        if (numRemoved > 0) {
            res.redirect("/products");
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
};
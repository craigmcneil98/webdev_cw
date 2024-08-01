const productDao = require('../models/productModel.js');

const product_db = new productDao({ filename: "products.db", autoload: true });
product_db.init();

exports.landing_page = function (req, res) {
    res.render("landing", {
        title: "About Us"
    }
    );
};

// Function to load and populate the products page.
exports.products_page = async function (req, res) {
    try {
        // Get all products from the DAO
        const products = await product_db.getAllProducts();

        // Fills the products page with the received products
        res.render("products", {
            title: "Products",
            products: products
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
};

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
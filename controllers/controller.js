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
        // Fetch all products from the DAO
        const products = await product_db.getAllProducts();

        // Render the products page with the fetched products
        res.render("products", {
            title: "Products",
            products: products
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
};
const productDAO = require('../models/productModel.js');
const { user_db } = require('./userController');

const product_db = new productDAO({ filename: "products.db", autoload: true });
product_db.init();

// Render landing page
exports.landing_page = function (req, res) {
    const user = req.user;
    console.log(user);
    res.render("landing", {
        title: "About Us",
        currentUser: user
    });
};

// Render login page
exports.login_page = function (req, res) {
    res.render("user/login");
};

// Render and populate the admin page
exports.admin_page = async function (req, res) {
    try {
        const user = req.user;  
        const users = await user_db.getAllUsers();
        res.render("admin", {
            title: "Admin Management",
            users: users,
            currentUser: user
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Render the products page with location-based filtering
exports.products_page = async function (req, res) {
    try {
        const currentUser = req.user;  // Assume req.user contains the current user data

        let products;

        if (!currentUser) {
            // No user is logged in, fetch all products
            products = await product_db.getAllProducts();
        } else {
            // User is logged in, fetch products based on current user's location
            products = await product_db.getProductsByLocation(currentUser.location);
        }

        res.render("products", {
            products: products,
            currentUser
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Render and populate the products page
exports.details_page = async function (req, res) {
    try {
        const user = req.user;
        const productId = req.params.id; 
        const product = await product_db.getProductById(productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("details", {
            title: "Product Details",
            product: product,
            currentUser: user
        });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Function to update product listings
exports.update_product = async function (req, res) {
    try {
        const productId = req.params.id;
        const updatedData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
        };

        const updatedProduct = await product_db.updateProduct(productId, updatedData);
        
        if (!updatedProduct) {
            return res.status(404).send("Product not found or update failed");
        }

        res.redirect('/products');
    } catch (err) {
        console.error("Error updating product:", err);
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
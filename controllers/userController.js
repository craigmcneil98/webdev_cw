const bcrypt = require("bcrypt");
const UserDAO = require("../models/userModel");
const jwt = require("jsonwebtoken");

const user_db = new UserDAO({ filename: "users.db", autoload: true });
user_db.init();

// Function to handle user login
exports.login = async function (req, res) {
    const { username, password } = req.body;

    try {
        const user = await user_db.lookup(username);
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).send("User not found");
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (isMatch) {
            const payload = { username: user.user, role: user.role };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

            res.cookie("jwt", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.redirect("/");
        } else {
            console.log('Invalid password attempt for user:', username);
            return res.status(403).send("Invalid password");
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).send("Internal Server Error");
    }
};

// Function to handle user logout
exports.logout = function (req, res) {
    res.cookie("jwt", "", { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0) });
    return res.redirect("/");
};

// Function to verify user is logged in
exports.verify = function (req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(403).send("No token provided");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(403).send("Invalid token");
        }
        req.user = decoded;
        next();
    });
};

// Function to verify user is logged in as admin
exports.verifyAdmin = function (req, res, next) {
    exports.verify(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).send("Access denied. Admins only.");
        }
    });
};

// Function to handle account registration
exports.register = async function (req, res) {
    const { username, password, role } = req.body;

    try {
        const existingUser = await user_db.lookup(username);
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        await user_db.create(username, password, role || 'normalUser');

        return res.redirect("/login");
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).send("Internal Server Error");
    }
};
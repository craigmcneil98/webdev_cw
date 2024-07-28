const express = require('express');
const router = express.Router();

// Route to render the index.mustache template
router.get('/', (req, res) => {
    res.render('index', {
        title: 'My Node.js App',
        header: 'Welcome to My Node.js App',
        message: 'This is a sample page rendered using Mustache.'
    });
});

module.exports = router;
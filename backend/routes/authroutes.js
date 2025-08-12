const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/create-super-admin', authController.createSuperAdmin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.get('/reset-password/:token', (req, res) => {
    // Here can send an HTML file or let it be handled by React. 
    // Because this app is based on React, will need to add this route to the front end.
});

module.exports = router;
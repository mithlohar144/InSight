const express = require('express')
const authController = require('../controllers/auth.controllers')

const authRoutes = express.Router();


authRoutes.post('/register', authController.RegiterController);
authRoutes.post('/login', authController.loginController)

module.exports = authRoutes;

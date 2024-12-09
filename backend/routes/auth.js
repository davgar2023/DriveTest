const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a user
 */
router.post('/register', register);
/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 */
router.post('/login', login);
/**
 * @route   POST /api/auth/refresh
 * @desc    refresh token 
 */
router.post('/refresh', refreshToken);
/**
 * @route   POST /api/auth/logout
 * @desc    logout a user from app
 */
router.post('/logout', logout);


module.exports = router;

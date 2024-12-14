const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const { createSite, getSites } = require('../controllers/siteContraller');
const permission = require('../middleware/permission');

/**
 * @route   POST /api/sites
 * @desc    Add Site's new 
 */
router.post('/', auth, createSite);
/**
 * @route   GET /api/sites
 * @desc    All sites 
 */
router.get('/', auth, getSites);

module.exports = router;

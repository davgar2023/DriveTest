const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const { createSite, getSites } = require('../controllers/siteContraller');
const permission = require('../middleware/permission');

/**
 * @route   POST /api/sites
 * @desc    Add Site's new 
 */
router.post('/sites', auth, createSite);
/**
 * @route   GET /api/sites
 * @desc    All sites 
 */
router.get('/sites', auth, getSites);

module.exports = router;

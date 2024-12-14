const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const { createSite, getSites } = require('../controllers/siteController');
const permission = require('../middleware/permission');

/**
 * @route   POST /api/sites
 * @desc    Add Site's new 
 */
router.post('/', auth, permission('create_site'), createSite);
/**
 * @route   GET /api/sites
 * @desc    All sites 
 */
router.get('/', auth, permission('view_sites'), getSites);

module.exports = router;

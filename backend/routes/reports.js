const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} = require('../controllers/reportController');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');

/**
 * @route   POST /api/reports
 * @desc    Create a report
 */
router.post('/', auth, permission('create_report'), createReport);

/**
 * @route   GET /api/reports
 * @desc    Get all reports
 */
router.get('/', auth, permission('view_reports'), getReports);

/**
 * @route   PUT /api/reports/:id
 * @desc    Update a report
 */
router.put('/:id', auth, permission('edit_report'), updateReport);

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete a report
 */
router.delete('/:id', auth, permission('delete_report'), deleteReport);

module.exports = router;

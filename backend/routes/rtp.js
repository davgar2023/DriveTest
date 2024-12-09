const express = require('express');
const router = express.Router();
const { processTRP, downloadReport } = require('../controllers/rtpController');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const { getAllPPTXFiles } = require("../controllers/rtpController");


/**
 * @route   POST /api/rtp/upload
 * @desc    RTP upload for user
 */
router.post('/upload',auth,
    permission('upload_file'),
     processTRP);
/**
 * @route   POST /api/rtp/download
 * @desc   RTP a user
 */
router.post('/download', downloadReport);

/**
 * @route   POST /api/rtp/reports/list
 * @desc   RTP a user
 */
router.get("/reports/list", auth, permission('view_files'), getAllPPTXFiles);


module.exports = router;
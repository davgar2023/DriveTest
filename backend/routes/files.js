const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFile,
  getFilesByUser,
  updateFile,
  deleteFile,
} = require('../controllers/fileController');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const upload = require('../utils/upload');

/**
 * @route   POST /api/files
 * @desc    Upload a file
 */
router.post(
  '/',
  auth,
  permission('upload_file'),
  upload.single('file'),
  uploadFile
);

/**
 * @route   GET /api/files/:id
 * @desc    Get a file
 */
router.get('/:id', auth, permission('view_files'), getFile);

/**
 * @route   GET /api/files/user/:id
 * @desc    Get a files by userId
 */
router.get('/user/:id', auth, permission('view_files'), getFilesByUser);


/**
 * @route   PUT /api/files/:id
 * @desc    Update a file
 */
router.put(
  '/:id',
  auth,
  permission('edit_file'),
  upload.single('file'),
  updateFile
);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete a file
 */
router.delete('/:id', auth, permission('delete_file'), deleteFile);

module.exports = router;

const multer = require('multer');

/**
 * Multer storage configuration to store files in memory.
 * You can change this to store files on disk or a cloud service.
 */
const storage = multer.memoryStorage();

/**
 * Multer upload middleware configured to accept single file uploads.
 * You can adjust the limits and file filter as needed.
 */
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Accept only certain file types if needed
    cb(null, true);
  },
});

module.exports = upload;

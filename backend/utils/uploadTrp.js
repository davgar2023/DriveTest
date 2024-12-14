const multer = require('multer');
const path = require("path"); // Node.js module to handle file paths
const debug = require('debug')('app:storageRTP'); // Namespace for debugging
const fs = require('fs'); // Use the promise-based fs

const uploadDir = path.join(__dirname, '../uploads');
/**
 * Creates a directory if it does not already exist.
 * @param {string} dirPath - The path of the directory to create.
 */



/**
 * Multer storage configuration to store files in memory.
 * You can change this to store files on disk or a cloud service.
 */

// Ensure that the upload directory exists
// If it does not, create it (recursive: true ensures that nested directories are created if needed)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Double-checking folder existence before upload (optional)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Set the filename. You can keep the original name or generate a unique one.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

/**
 * Multer upload middleware configured to accept single file uploads.
 * You can adjust the limits and file filter as needed.
 */

const upload = multer({ storage });

module.exports = upload;

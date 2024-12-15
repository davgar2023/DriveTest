const mongoose = require('mongoose');
const debug = require('debug')('app:getFilesByUser'); // Namespace for debugging
const File = require('../models/File');
const formatFileSize = require('../utils/formatterSize');


/**
 * Upload a file
 * @param {Object} req
 * @param {Object} res
 */
exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const file = new File({
      name: req.file.originalname,
      data: req.file.buffer,
      mimetype: req.file.mimetype,
      size: req.file.size,
      createdBy: req.user._id,

    });
    await file.save();
    debug('Response sent successfully Upload...'); // Debug response
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
    debug('Error upload file->',  error.message); // Debug response
  }
};

/**
 * Get a file
 * @param {Object} req
 * @param {Object} res
 */
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.set('Content-Type', file.mimetype);
    res.send(file.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
    
};

/**
 * Get all files by user
 * @param {Object} req
 * @param {Object} res
 */
exports.getFilesByUser = async (req, res) => {

  

    try {
     // const { id } = req.params; // Get the userId from the route params

       debug('Received request to fetch files for User ID:',  req.user); // Debug input

  
      // Validate the User ID
      if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
       debug('Invalid User ID:', req.user._id); // Debug invalid ID
        return res.status(400).json({ message: 'Invalid user ID' });
      }

  
  
      // Find files created by the user
      const files = await File.find({  createdBy: req.user._id }).select('id name mimetype createdAt updatedAt createdBy size') .lean(); // Optimize with selected fields
      if (files.length === 0) {
        debug('No files found for User ID:', req.user._id); // Debug no files found
        return res.status(404).json({ message: 'No files found for the given user' });
      }


      const filesWithFormattedSize = files.map(file => ({
        ...file,
        formattedSize: formatFileSize(file.size)
      }));
  
   debug(`Found ${files.length} file(s) for User ID:`, req.user._id); // Debug number of files

      // Return the list of files
      return  res.status(200).json({
        message: 'Files retrieved successfully',
        files:  filesWithFormattedSize,
      });
     
       
    } catch (error) {
    debug('Error fetching files:', error.message); // Debug error
      console.error('Error fetching files:', error);
      return res.status(500).json({
        message: 'An error occurred while retrieving the files',
        details: error.message,
      });
    }
};


/**
 * Update a file
 * @param {Object} req
 * @param {Object} res
 */
exports.updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    if (req.file) {
      file.name = req.file.originalname;
      file.data = req.file.buffer;
      file.mimetype = req.file.mimetype;
    }

    await file.save();
    res.json({ message: 'File updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a file
 * @param {Object} req
 * @param {Object} res
 */
exports.deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

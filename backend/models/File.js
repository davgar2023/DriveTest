const mongoose = require('mongoose');

/**
 * File Schema
 */
const FileSchema = new mongoose.Schema(
  {
    name: String,
    data: Buffer,
    mimetype: String,
     size: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', FileSchema);

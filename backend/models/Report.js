const mongoose = require('mongoose');

/**
 * Report Schema
 */
const ReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    ticketedId: {
      type: String,
      unique: true,
      required: true
    },
    
    dateTime: {
    type: Date,
    required: true
  },

  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  }

  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);

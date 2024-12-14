const mongoose = require('mongoose');
/**
 * Sites Schema
 */
const SiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  codeSite: {
    type: String,
    required: true,
    unique: true
  },
  description: String
});

module.exports = mongoose.model('Site', SiteSchema);

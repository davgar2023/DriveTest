const mongoose = require('mongoose');

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

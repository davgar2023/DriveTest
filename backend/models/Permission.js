const mongoose = require('mongoose');

/**
 * Permission Schema
 */
const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Permission', PermissionSchema);

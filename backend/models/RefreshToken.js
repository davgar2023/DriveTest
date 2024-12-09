const mongoose = require('mongoose');

/**
 * Refresh Token Schema
 */
const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);

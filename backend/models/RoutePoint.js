const mongoose = require('mongoose');
/**
 * Route information Schema
 */
const RoutePointSchema = new mongoose.Schema({
  routeId: String,
  latitude: Number,
  longitude: Number,
  timestamp: Date,
  details: String,
});

module.exports = mongoose.model('RoutePoint', RoutePointSchema);

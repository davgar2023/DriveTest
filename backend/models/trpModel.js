const mongoose = require("mongoose");
/**
 * Trp total Schema
 */
const trpSchema = new mongoose.Schema({
    fileName: String,
    uploadDate: { type: Date, default: Date.now },
    totalRoutes: Number,
    totalEvents: Number,
});

module.exports = mongoose.model("TRP", trpSchema);

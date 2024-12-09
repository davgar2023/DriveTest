const mongoose = require("mongoose");
/**
 * Metrics  Schema
 */
const metricsSchema = new mongoose.Schema({
    trpId: { type: mongoose.Schema.Types.ObjectId, ref: "TRP" },
    rsrp: Number,
    sinr: Number,
    throughput: Number,
    timestamp: String,
});

module.exports = mongoose.model("Metrics", metricsSchema);

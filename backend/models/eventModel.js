const mongoose = require("mongoose");
/**
 * Event Schema
 */
const eventSchema = new mongoose.Schema({
    trpId: { type: mongoose.Schema.Types.ObjectId, ref: "TRP" },
    eventType: String,
    timestamp: String,
    description: String,
});

module.exports = mongoose.model("Event", eventSchema);

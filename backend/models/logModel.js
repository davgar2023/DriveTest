const mongoose = require("mongoose");
/**
 * Logs Schema
 */
const logSchema = new mongoose.Schema({
    trpId: { type: mongoose.Schema.Types.ObjectId, ref: "TRP" },
    content: String, // content information log 
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);

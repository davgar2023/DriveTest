const mongoose = require("mongoose");
/**
 * Metadata time information  Schema
 */
const metadataSchema = new mongoose.Schema({
    trpId: { type: mongoose.Schema.Types.ObjectId, ref: "TRP" },
    startTime: String,
    stopTime: String,
    status: {
        id: Number,
        value: String,
    },
    userName: String,
    isAdmin: Boolean,
});

module.exports = mongoose.model("Metadata", metadataSchema);


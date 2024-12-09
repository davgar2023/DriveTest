const mongoose = require("mongoose");

/**
 * Route information with specific data Schema
 */
const routeSchema = new mongoose.Schema({
    trpId: { type: mongoose.Schema.Types.ObjectId, ref: "TRP" },
    coordinates: String,
    distance: Number,
    imagePath: String,
});

module.exports = mongoose.model("Route", routeSchema);

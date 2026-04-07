const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  regionName: String
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);
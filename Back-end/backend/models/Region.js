const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Region", regionSchema);
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: String
}, { timestamps: true });

module.exports = mongoose.model("Tag", tagSchema);
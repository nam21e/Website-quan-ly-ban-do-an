const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  regionName: String,
  authorName: String,
  isHighlighted: Boolean,
  createdAt: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
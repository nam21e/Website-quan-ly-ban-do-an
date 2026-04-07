const mongoose = require("mongoose");

const postTagSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }
}, { timestamps: true });

module.exports = mongoose.model("PostTag", postTagSchema);
const mongoose = require("mongoose");

const commentReactionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "like"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }
}, { timestamps: true });

module.exports = mongoose.model("CommentReaction", commentReactionSchema);
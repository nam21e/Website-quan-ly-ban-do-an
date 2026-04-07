const CommentReaction = require("../models/CommentReaction");

const getCommentReactions = async (req, res) => {
  try {
    res.json(await CommentReaction.find().populate("userId commentId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCommentReactionById = async (req, res) => {
  try {
    res.json(await CommentReaction.findById(req.params.id).populate("userId commentId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCommentReaction = async (req, res) => {
  try {
    res.json(await CommentReaction.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCommentReaction = async (req, res) => {
  try {
    res.json(await CommentReaction.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCommentReaction = async (req, res) => {
  try {
    await CommentReaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted comment reaction" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCommentReactions,
  getCommentReactionById,
  createCommentReaction,
  updateCommentReaction,
  deleteCommentReaction
};
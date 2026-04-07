const Comment = require("../models/Comment");

const getComments = async (req, res) => {
  try {
    res.json(await Comment.find().populate("userId postId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    res.json(await Comment.findById(req.params.id).populate("userId postId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    res.json(await Comment.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    res.json(await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted comment" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getComments, getCommentById, createComment, updateComment, deleteComment };
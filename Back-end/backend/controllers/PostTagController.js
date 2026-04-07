const PostTag = require("../models/PostTag");

const getPostTags = async (req, res) => {
  try {
    res.json(await PostTag.find().populate("postId tagId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostTagById = async (req, res) => {
  try {
    res.json(await PostTag.findById(req.params.id).populate("postId tagId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPostTag = async (req, res) => {
  try {
    res.json(await PostTag.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePostTag = async (req, res) => {
  try {
    res.json(await PostTag.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePostTag = async (req, res) => {
  try {
    await PostTag.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted postTag" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPostTags, getPostTagById, createPostTag, updatePostTag, deletePostTag };
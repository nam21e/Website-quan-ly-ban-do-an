const Post = require("../models/Post");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts.map(p => ({
      id: p._id,
      title: p.title,
      content: p.content,
      imageUrl: p.imageUrl,
      regionName: p.regionName,
      authorName: p.authorName,
      isHighlighted: p.isHighlighted,
      createdAt: p.createdAt
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    res.json(await Post.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    res.json(await Post.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    res.json(await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted post" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
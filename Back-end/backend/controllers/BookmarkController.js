const Bookmark = require("../models/Bookmark");

const getBookmarks = async (req, res) => {
  try {
    res.json(await Bookmark.find().populate("userId postId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookmarkById = async (req, res) => {
  try {
    res.json(await Bookmark.findById(req.params.id).populate("userId postId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBookmark = async (req, res) => {
  try {
    res.json(await Bookmark.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBookmark = async (req, res) => {
  try {
    res.json(await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted bookmark" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBookmarks, getBookmarkById, createBookmark, updateBookmark, deleteBookmark };
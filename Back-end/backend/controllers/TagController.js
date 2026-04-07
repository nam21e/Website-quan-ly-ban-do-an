const Tag = require("../models/Tag");

const getTags = async (req, res) => {
  try {
    res.json(await Tag.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTagById = async (req, res) => {
  try {
    res.json(await Tag.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTag = async (req, res) => {
  try {
    res.json(await Tag.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTag = async (req, res) => {
  try {
    res.json(await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted tag" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTags, getTagById, createTag, updateTag, deleteTag };
const Region = require("../models/Region");

const getRegions = async (req, res) => {
  try {
    res.json(await Region.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRegionById = async (req, res) => {
  try {
    res.json(await Region.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRegion = async (req, res) => {
  try {
    res.json(await Region.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRegion = async (req, res) => {
  try {
    res.json(await Region.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRegion = async (req, res) => {
  try {
    await Region.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted region" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRegions, getRegionById, createRegion, updateRegion, deleteRegion };

const Location = require("../models/Location");

const getLocations = async (req, res) => {
  try {
    res.json(await Location.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLocationById = async (req, res) => {
  try {
    res.json(await Location.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createLocation = async (req, res) => {
  try {
    res.json(await Location.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    res.json(await Location.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted location" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLocations, getLocationById, createLocation, updateLocation, deleteLocation };
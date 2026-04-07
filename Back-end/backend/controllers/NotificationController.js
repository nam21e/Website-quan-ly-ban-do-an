const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    res.json(await Notification.find().populate("userId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    res.json(await Notification.findById(req.params.id).populate("userId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNotification = async (req, res) => {
  try {
    res.json(await Notification.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    res.json(await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted notification" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
};
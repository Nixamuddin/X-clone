import Notification from "../Models/Notification.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      to: userId,
      seen: true,
    }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).send({ message: "Notification not found" });
    }
    res.status(200).send({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

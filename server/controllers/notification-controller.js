const User = require("../model/user.js");

async function saveChanges(req, res) {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ error: "Preferences are required" });
    }

    // Update only the notificationPreferences field
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { notificationPreferences: preferences } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Preferences updated successfully",
      preferences: updatedUser.notificationPreferences,
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendNotification(req, res) {
  try {
    // Get the user data from DB and extract their Preferences
    const userData = await User.findById(req.user.id);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build an object from notification preferences
    const preferences = {
      email: userData.notificationPreferences.email,
      sms: userData.notificationPreferences.sms,
      push: userData.notificationPreferences.push,
      inapp: userData.notificationPreferences.inapp,
      whatsapp: userData.notificationPreferences.whatsapp,
    };
    // Send it in response
    return res.json({
      message: "User preferences fetched successfully",
      preferences,
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return res.status(500).json({
      error: "An error occurred while fetching user preferences",
      details: error.message, // optional: for debugging
    });
  }
}
module.exports = { saveChanges, sendNotification };

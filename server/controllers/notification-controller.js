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

module.exports = { saveChanges };

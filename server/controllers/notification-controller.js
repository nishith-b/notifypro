const User = require("../model/user.js");
const { PublishCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("../config/snsClient.js");

// Publish a message to SNS with the given channel
async function publishMessage(channel) {
  const params = {
    TopicArn: "arn:aws:sns:ap-south-1:314146326314:notifypro-root.fifo",
    Message: `Hello, this is a notification for ${channel}`,
    MessageGroupId: "notify-group",
    MessageDeduplicationId: Date.now().toString(),
    MessageAttributes: {
      channel: {
        DataType: "String",
        StringValue: channel,
      },
    },
  };

  try {
    const result = await snsClient.send(new PublishCommand(params));
    console.log("Message sent! ID:", result.MessageId);
  } catch (err) {
    console.error("Publish failed:", err);
  }
}

// Save or update user notification preferences
async function saveChanges(req, res) {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ error: "Preferences are required" });
    }

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

// Send notifications based on user preferences
async function sendNotification(req, res) {
  try {
    const userData = await User.findById(req.user.id);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const preferences = {
      email: userData.notificationPreferences.email,
      sms: userData.notificationPreferences.sms,
      push: userData.notificationPreferences.push,
      inapp: userData.notificationPreferences.inapp,
      whatsapp: userData.notificationPreferences.whatsapp,
    };

    if (preferences.email) publishMessage("email");
    if (preferences.sms) publishMessage("sms");
    if (preferences.push) publishMessage("push");
    if (preferences.inapp) publishMessage("inapp");
    if (preferences.whatsapp) publishMessage("whatsapp");

    return res.json({
      message:
        "User preferences fetched successfully and notifications sent!",
      preferences,
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return res.status(500).json({
      error: "An error occurred while fetching user preferences",
      details: error.message,
    });
  }
}

module.exports = { saveChanges, sendNotification };

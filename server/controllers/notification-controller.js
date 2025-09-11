const User = require("../model/user.js");
const { PublishCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("../config/snsClient.js");

// Publish a message to SNS with the given channel and user data
async function publishMessage(channel, userData) {
  const params = {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: JSON.stringify({
      channel,
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        notificationPreferences: userData.notificationPreferences,
      },
      timestamp: new Date().toISOString(),
    }),
    MessageGroupId: "notify-group", // only needed if FIFO topic
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

    if (preferences.email) await publishMessage("email", userData);
    if (preferences.sms) await publishMessage("sms", userData);
    if (preferences.push) await publishMessage("push", userData);
    if (preferences.inapp) await publishMessage("inapp", userData);
    if (preferences.whatsapp) await publishMessage("whatsapp", userData);

    return res.json({
      message: "User preferences fetched successfully and notifications sent!",
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

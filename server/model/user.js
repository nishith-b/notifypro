// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    notificationPreferences: {
      email: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      inapp: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

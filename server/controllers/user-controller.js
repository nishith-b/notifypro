const bcrypt = require("bcryptjs");
const User = require("../model/user.js");

// @desc    User Signup
// @route   POST /api/auth/signup
// @access  Public

async function handleSignup(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    //Return response (never send plain password!)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error) {
    
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { handleSignup };

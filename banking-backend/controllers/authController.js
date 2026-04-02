const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register a new user with Gmail + Password Validation
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Gmail validation: must end with @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Invalid Gmail address. It must end with @gmail.com' });
    }

    // ✅ Password length check
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log("🔐 New user registered:", newUser.email);
    console.log("🔑 JWT Token generated:", token);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      name: newUser.name,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("➡️ User found:", user.email);
    console.log("🔑 Plain password:", password);
    console.log("🔐 Stored hash:", user.password);

    const isMatch = await user.matchPassword(password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      name: user.name,
      lastLogin: user.lastLogin,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get current user info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ GetMe Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };

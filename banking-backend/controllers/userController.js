const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @desc    Register new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Authenticate user and get token
// @route   POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// @desc    Get all users
// @route   GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// @desc    Update user's payment info (UPI, Cheque, NEFT)
// @route   PUT /api/users/update-payment-info
const updatePaymentInfo = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      currentUpiPin,
      upiId,
      upiPin,
      chequeNumber,
      neftReferenceId,
    } = req.body;

    // Require current PIN if user already has one
    if (user.upiPin) {
      if (!currentUpiPin) {
        return res.status(400).json({ message: "Current UPI PIN is required" });
      }

      const isMatch = await user.matchUpiPin(currentUpiPin);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current UPI PIN" });
      }
    }

    // Update UPI ID
    if (upiId !== undefined) {
      user.upiId = upiId;
    }

    // Update UPI PIN
    if (upiPin !== undefined) {
      if (user.upiPin && upiPin === user.upiPin) {
        return res.status(400).json({ message: "New UPI PIN must be different" });
      }
      user.upiPin = upiPin;
    }

    // Update Cheque Number
    if (chequeNumber !== undefined) {
      user.chequeNumber = chequeNumber;
    }

    // Update NEFT Reference ID
    if (neftReferenceId !== undefined) {
      user.neftReferenceId = neftReferenceId;
    }

    await user.save();

    res.status(200).json({
      message: "Payment information updated successfully",
      upiId: user.upiId,
      chequeNumber: user.chequeNumber,
      neftReferenceId: user.neftReferenceId,
      upiPin: user.upiPin ? "******" : null,
    });
  } catch (err) {
    console.error("Error in updatePaymentInfo:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updatePaymentInfo,
};

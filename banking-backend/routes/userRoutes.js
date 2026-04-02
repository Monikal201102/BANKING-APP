const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updatePaymentInfo,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// ✅ Register a new user
router.post("/", registerUser);

// ✅ Login user
router.post("/login", loginUser);

// ✅ Get all users (protected)
router.get("/", protect, getAllUsers);

// ✅ Get user by ID (protected)
router.get("/:id", protect, getUserById);

// ✅ Get current logged-in user (used in Dashboard)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update user's payment info (requires UPI PIN if already set)
router.put("/update-payment-info", protect, updatePaymentInfo);

module.exports = router;

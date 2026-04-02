const express = require("express");
const router = express.Router();
const { applyLoan, recommendLoan } = require("../controllers/loanController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/loans/apply
// @desc    Apply for a loan
// @access  Private
router.post("/apply", protect, applyLoan);

// @route   GET /api/loans/recommend
// @desc    Recommend loan based on user's transaction history
// @access  Private
router.get("/recommend", protect, recommendLoan);

module.exports = router;

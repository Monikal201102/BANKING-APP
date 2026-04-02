const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionSummary,
  recommendLoan,
  withdrawFunds, // Add this
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

// ✅ Apply the `protect` middleware to all routes that need authentication
router.post("/", protect, createTransaction);
router.post("/withdraw", protect, withdrawFunds); // 🔥 ADD THIS
router.get("/", protect, getTransactions);

// ✅ Place static routes BEFORE dynamic :id route
router.get("/summary", protect, getTransactionSummary);
router.get("/recommend-loan", protect, recommendLoan);

// ✅ Dynamic route LAST
router.get("/:id", protect, getTransactionById);

module.exports = router;

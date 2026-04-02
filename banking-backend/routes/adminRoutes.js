const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminAuthController");
const { getAllUsers, getAllTransactions, changeAdminPassword } = require("../controllers/adminController");
const verifyAdminToken = require("../middleware/verifyAdminToken");

// Admin Login
router.post("/login", adminLogin);

// ✅ Get all registered users
router.get("/users", verifyAdminToken, getAllUsers);

// ✅ Get all transactions
router.get("/transactions", verifyAdminToken, getAllTransactions);

// ✅ Change admin password
router.post("/change-password", verifyAdminToken, changeAdminPassword);

module.exports = router;

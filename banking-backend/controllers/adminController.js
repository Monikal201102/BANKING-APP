const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Get all registered users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// Get all transactions (admin only)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('userId', 'name email') // populate user info
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch transactions.' });
  }
};

// Change admin password securely
exports.changeAdminPassword = async (req, res) => {
  const adminId = req.admin.id;  // from verifyAdminToken middleware
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

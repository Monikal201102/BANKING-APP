const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Received Token:", token);
    console.log("Decoded JWT:", decoded);

    // Fetch limited user info to attach to req
    const user = await User.findById(decoded.id).select('_id name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };

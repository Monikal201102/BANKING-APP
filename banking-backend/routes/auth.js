const express = require('express'); 
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // ✅ import the middleware

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// ✅ @route GET /api/auth/me
// ✅ @desc Get logged-in user's info using controller logic
router.get('/me', protect, getMe);

module.exports = router;

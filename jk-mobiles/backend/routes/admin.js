const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const protect = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /admin/setup — First-time admin setup (run once)
router.post('/setup', async (req, res) => {
  try {
    const existing = await Admin.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists.' });
    }
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@jkmobiles.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
    });
    res.status(201).json({ success: true, message: 'Admin created successfully.', email: admin.email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(admin._id);
    res.json({ success: true, message: 'Login successful.', token, email: admin.email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /admin/me — Verify token
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = router;

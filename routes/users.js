const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Note to self: Tia, this is the registration endpoint
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Note to self: Tia, check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Note to self: Tia, create new user, password will be hashed by pre-save hook
    const user = new User({ username, email, password });
    await user.save();
    // Note to self: Tia, respond with user data excluding password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Note to self: Tia, this is the login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Note to self: Tia, find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    // Note to self: Tia, check password
    const isMatch = await user.isCorrectPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    // Note to self: Tia, create JWT token
    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Note to self: Tia, respond with token and user data
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
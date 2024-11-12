const express = require('express');
const User = require('../models/User');

const router = express.Router();

// POST route to handle user signup
router.post('/signup', async (req, res) => {
  try {
    const { profilePicture, fullName, email, password, bio } = req.body;

    // Create a new user
    const newUser = new User({ profilePicture, fullName, email, password, bio });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

module.exports = router;

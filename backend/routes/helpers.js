const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');


router.patch('/toggle-availability', auth, async (req, res) => {
  if (req.user.role !== 'helper') return res.status(403).json({ msg: 'Not authorized' });

  req.user.isAvailable = req.body.available;
  await req.user.save();

  res.json({ msg: 'Availability updated', isAvailable: req.user.isAvailable });
});


router.post('/location', auth, async (req, res) => {
  try {
    if (req.user.role !== 'helper') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const { coords } = req.body; 
    req.user.location = { type: 'Point', coordinates: coords };
    await req.user.save();
    res.json({ msg: 'Location updated', location: req.user.location });
  } catch (err) {
    res.status(500).json({ err });
  }
});


router.get('/me', auth, async (req, res) => {
  if (req.user.role !== 'helper') return res.status(403).json({ msg: 'Not authorized' });
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAvailable: req.user.isAvailable
  });
});



router.get('/wallet', auth, async (req, res) => {
  try {
    if (req.user.role !== 'helper') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    res.json({ walletBalance: req.user.walletBalance });
  } catch (err) {
    res.status(500).json({ err });
  }
});


router.post('/wallet/withdraw', auth, async (req, res) => {
  try {
    if (req.user.role !== 'helper') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const { amount } = req.body;
    if (amount > req.user.walletBalance) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    req.user.walletBalance -= amount;
    await req.user.save();

    res.json({ msg: 'Withdrawal requested', remainingBalance: req.user.walletBalance });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;

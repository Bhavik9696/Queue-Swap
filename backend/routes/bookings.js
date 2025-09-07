const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// create booking (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { queueType, locationName, coords, amount, eta } = req.body;

    // basic validation
    if (!queueType || !locationName || !coords || coords.length !== 2 || !amount || !eta) {
      return res.status(400).json({ msg: 'Missing required booking data' });
    }

    // create booking
    const booking = await Booking.create({
      customer: req.user._id,
      queueType,
      locationName,
      location: { type: 'Point', coordinates: coords },
      amount,
      platformCommission: Math.round(amount * 0.2), // example 20% commission
      eta,
      status: 'pending'
    });

    // notify nearby helpers via socket.io
    const io = req.app.get('io');
    if (io) {
      const nearbyHelpers = await User.find({
        role: 'helper',
        isAvailable: true,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: coords },
            $maxDistance: 2000
          }
        }
      }).limit(10);

      nearbyHelpers.forEach(h => {
        io.to(`user:${h._id}`).emit('newBooking', { booking });
      });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ msg: 'Booking creation failed', err: err.message });
  }
});

// assign helper to booking
router.post('/:id/assign', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.helper) return res.status(400).json({ msg: 'Already assigned' });

    booking.helper = req.user._id;
    booking.status = 'assigned';
    await booking.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.customer}`).emit('bookingAssigned', { booking });
      io.to(`booking:${booking._id}`).emit('assigned', { booking });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Assign booking error:', err);
    res.status(500).json({ msg: 'Failed to assign booking', err: err.message });
  }
});

// complete booking
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (!booking.helper || booking.helper.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to complete this booking' });
    }

    booking.status = 'completed';
    await booking.save();

    const helperEarnings = booking.amount - booking.platformCommission;
    req.user.walletBalance += helperEarnings;
    await req.user.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.customer}`).emit('bookingCompleted', { booking });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Complete booking error:', err);
    res.status(500).json({ msg: 'Failed to complete booking', err: err.message });
  }
});

module.exports = router;

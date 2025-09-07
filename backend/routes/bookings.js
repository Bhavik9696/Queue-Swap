const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// create booking (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { queueType, locationName, coords, amount, eta } = req.body; // coords = [lng,lat]
    const booking = await Booking.create({
      customer: req.user._id,
      queueType,
      locationName,
      location: { type: 'Point', coordinates: coords },
      amount,
      platformCommission: Math.round(amount * 0.2), // example 20% commission
      eta
    });

    // notify nearby helpers via socket.io:
    const io = req.app.get('io');
    // find helpers near location (2km radius)
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

    res.json({ booking });
  } catch (err) { res.status(500).json({ err }); }
});


router.post('/:id/assign', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Not found' });
    if (booking.helper) return res.status(400).json({ msg: 'Already assigned' });
    booking.helper = req.user._id;
    booking.status = 'assigned';
    await booking.save();

    const io = req.app.get('io');
    io.to(`user:${booking.customer}`).emit('bookingAssigned', { booking });
    io.to(`booking:${booking._id}`).emit('assigned', { booking });
    res.json({ booking });
  } catch (err) { res.status(500).json({ err }); }
});

router.post('/:id/complete', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Not found' });
    if (!booking.helper || booking.helper.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'Not helper' });
    booking.status = 'completed';
    await booking.save();

    const helperEarnings = booking.amount - booking.platformCommission;
    req.user.walletBalance += helperEarnings;
    await req.user.save();

    const io = req.app.get('io');
    io.to(`user:${booking.customer}`).emit('bookingCompleted', { booking });

    res.json({ booking });
  } catch (err) { res.status(500).json({ err }); }
});

module.exports = router;

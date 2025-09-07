const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

  
    const amount = Math.round(booking.amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: { bookingId: booking._id.toString() }
    });

    

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

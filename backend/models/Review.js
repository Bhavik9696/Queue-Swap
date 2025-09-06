const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);

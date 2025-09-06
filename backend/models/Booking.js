const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  queueType: { type: String, required: true }, // bank,hospital,ticket,...
  locationName: { type: String },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] },
  status: { type: String, enum: ['pending','assigned','holding','completed','cancelled'], default: 'pending' },
  amount: { type: Number, required: true },
  platformCommission: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  eta: { type: Date } // estimated swap time
}, { timestamps: true });

bookingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Booking', bookingSchema);

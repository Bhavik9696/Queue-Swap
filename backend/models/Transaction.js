const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['credit','debit'] },
  amount: Number,
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

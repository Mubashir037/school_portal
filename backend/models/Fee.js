const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  grno: { type: String, required: true, trim: true },
  class: { type: String, required: true },
  month: { type: String, required: true }, // e.g. "2026-08"
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paidOn: { type: Date },
  receiptNo: { type: String }
}, { timestamps: true });

feeSchema.index({ grno: 1, month: 1 }, { unique: true });

// fixed fee by class
feeSchema.statics.getAmountByClass = function (cls) {
  const n = parseInt(cls);
  if (n >= 1 && n <= 6) return 1800;
  if (n >= 7 && n <= 8) return 2000;
  if (n >= 9 && n <= 10) return 3000;
  if (n >= 11 && n <= 12) return 3500;
  return 0;
};

module.exports = mongoose.model('Fee', feeSchema);
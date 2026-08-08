const mongoose = require('mongoose');
const leavingCertificateSchema = new mongoose.Schema({
  grno: { type: String, required: true, unique: true, trim: true },
  progress: { type: String },
  date_of_leaving: { type: Date, required: true },
  class_at_leaving: { type: String, required: true },
  reason_for_leaving: { type: String, required: true },
  remarks: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('LeavingCertificate', leavingCertificateSchema);
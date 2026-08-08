const mongoose = require('mongoose');
const studentschema = new mongoose.Schema({
  grno: { type: String, unique: true, required: true, trim: true },
  first_name: { type: String, required: true },
  last_name: { type: String },
  father_name: { type: String },
  father_no: { type: String, match: [/^\d{11}$/, 'Father contact number must be exactly 11 digits'] },
  father_cnic: { type: String, match: [/^\d{13}$/, 'CNIC must be exactly 13 digits'] },
  dob: {
    type: Date,
    validate: { validator: (v) => v <= new Date(), message: 'Date of birth cannot be in the future' }
  },
  class: { type: String, required: true },
  cast: { type: String },
  religion: { type: String, required: true },
  place_of_birth: { type: String, required: true },
  last_school_attended: { type: String, required: true },
  date_of_admission: { type: Date, required: true },
  class_at_admission: { type: String, required: true },
  conduct: { type: String, required: true }
});
module.exports = mongoose.model('Student', studentschema);
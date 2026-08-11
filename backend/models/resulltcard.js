const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  obtainedMarks: { type: Number, required: true }
}, { _id: false });

const resultCardSchema = new mongoose.Schema({
  grno: { type: String, required: true, trim: true },
  session: { type: String, required: true },
  term: { type: String, required: true },
  class: { type: String, required: true },
  subjects: { type: [subjectSchema], required: true },
  totalMarks: { type: Number },
  obtainedMarks: { type: Number },
  percentage: { type: Number },
  grade: { type: String },
  remarks: { type: String }
}, { timestamps: true });

resultCardSchema.pre('save', function () {
  this.totalMarks = this.subjects.reduce((sum, s) => sum + s.totalMarks, 0);
  this.obtainedMarks = this.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
  this.percentage = ((this.obtainedMarks / this.totalMarks) * 100).toFixed(2);
});

module.exports = mongoose.model('ResultCard', resultCardSchema);
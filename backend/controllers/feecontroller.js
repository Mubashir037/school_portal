const Fee = require('../models/Fee');
const Student = require('../models/Student');

const generateFee = async (req, res) => {
  try {
    const { grno, month } = req.body;
    const student = await Student.findOne({ grno });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const amount = Fee.getAmountByClass(student.class);
    const fee = await Fee.create({ grno, class: student.class, month, amount });
    res.status(201).json(fee);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Fee already generated for this month' });
    res.status(400).json({ message: err.message });
  }
};

const markPaid = async (req, res) => {
  try {
    const receiptNo = 'RCPT-' + Date.now();
    const fee = await Fee.findByIdAndUpdate(req.params.id, { status: 'Paid', paidOn: new Date(), receiptNo }, { new: true });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFeesByStudent = async (req, res) => {
  try {
    const fees = await Fee.find({ grno: req.params.grno }).sort({ month: -1 });
    res.status(200).json(fees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllUnpaid = async (req, res) => {
  try {
    const fees = await Fee.find({ status: 'Unpaid' }).sort({ month: 1 });
    res.status(200).json(fees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { generateFee, markPaid, getFeesByStudent, getAllUnpaid };
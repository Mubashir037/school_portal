const ResultCard = require('../models/resulltcard');
const Student = require('../models/Student');

const createResultCard = async (req, res) => {
  try {
    const { grno } = req.body;
    const student = await Student.findOne({ grno });
    if (!student) return res.status(404).json({ message: 'No student found with this GR No' });
    const card = await ResultCard.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getResultCard = async (req, res) => {
  try {
    const card = await ResultCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Result card not found' });
    res.status(200).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getResultCardsByGrno = async (req, res) => {
  try {
    const cards = await ResultCard.find({ grno: req.params.grno }).sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateResultCard = async (req, res) => {
  try {
    const card = await ResultCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Result card not found' });
    Object.assign(card, req.body);
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteResultCard = async (req, res) => {
  try {
    const card = await ResultCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: 'Result card not found' });
    res.status(200).json({ message: 'Result card deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createResultCard, getResultCard, getResultCardsByGrno, updateResultCard, deleteResultCard };
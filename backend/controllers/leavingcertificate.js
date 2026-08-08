const LeavingCertificate = require('../models/Leavingcertificate');
const Student = require('../models/Student');

// issue (create)
const issueCertificate = async (req, res) => {
  try {
    const { grno } = req.body;

    const student = await Student.findOne({ grno });
    if (!student) {
      return res.status(404).json({ message: 'No student found with this GR No' });
    }

    const cert = await LeavingCertificate.create(req.body);
    res.status(201).json(cert);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A leaving certificate already exists for this GR No' });
    }
    res.status(400).json({ message: err.message });
  }
};

// get one by grno
const getCertificate = async (req, res) => {
  try {
    const cert = await LeavingCertificate.findOne({ grno: req.params.grno });
    if (!cert) {
      return res.status(404).json({ message: 'No leaving certificate found for this GR No' });
    }
    res.status(200).json(cert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update
const updateCertificate = async (req, res) => {
  try {
    const cert = await LeavingCertificate.findOneAndUpdate(
      { grno: req.params.grno },
      req.body,
      { new: true, runValidators: true }
    );
    if (!cert) {
      return res.status(404).json({ message: 'No leaving certificate found for this GR No' });
    }
    res.status(200).json(cert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// list all
const getAllCertificates = async (req, res) => {
  try {
    const certs = await LeavingCertificate.find();
    res.status(200).json(certs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { issueCertificate, getCertificate, updateCertificate, getAllCertificates };
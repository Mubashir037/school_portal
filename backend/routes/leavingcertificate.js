const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
const {
  issueCertificate, getCertificate, updateCertificate, getAllCertificates
} = require('../controllers/leavingcertificate');
const { generateCertificatePdf } = require('../controllers/pdf');

router.post('/issue', middleware, issueCertificate);
router.get('/all', middleware, getAllCertificates);
router.get('/:grno', middleware, getCertificate);
router.put('/:grno', middleware, updateCertificate);
router.get('/:grno/pdf', middleware, generateCertificatePdf);

module.exports = router;
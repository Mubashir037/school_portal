const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
const { generateFee, markPaid, getFeesByStudent, getAllUnpaid } = require('../controllers/feecontroller');
const { generateReceipt } = require('../controllers/receipt');

router.post('/generate', middleware, generateFee);
router.put('/:id/pay', middleware, markPaid);
router.get('/unpaid', middleware, getAllUnpaid);
router.get('/:id/receipt', middleware, generateReceipt);
router.get('/:grno', middleware, getFeesByStudent);

module.exports = router;
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
const {
  createResultCard, getResultCard, getResultCardsByGrno, updateResultCard, deleteResultCard
} = require('../controllers/resultcard');
const { generateResultCardPdf } = require('../controllers/resultpdf');

router.post('/create', middleware, createResultCard);
router.get('/student/:grno', middleware, getResultCardsByGrno);
router.get('/:id/pdf', middleware, generateResultCardPdf);
router.get('/:id', middleware, getResultCard);
router.put('/:id', middleware, updateResultCard);
router.delete('/:id', middleware, deleteResultCard);

module.exports = router;